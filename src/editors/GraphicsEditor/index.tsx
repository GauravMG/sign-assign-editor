import React, { useEffect, useRef, useState } from "react";
import {
	DownloadOutlined,
	FileImageOutlined,
	FontSizeOutlined,
	OrderedListOutlined,
	SearchOutlined,
	SmileOutlined,
	UploadOutlined,
	AppstoreAddOutlined,
} from "@ant-design/icons";
import { Button, Divider, Image, Input, Layout, List, Menu, message, Upload, Modal } from "antd";
import { fabric } from "fabric";
import LayersPanel from "../../components/LayersPanel";
import StickerPanel from "../../components/StickerPanel";
import TextToolbar from "../../components/TextToolbar";
import ShapesPanel from "../../components/ShapesPanel";
import CanvasSizePanel from "../../components/CanvasSizePanel";

const { Sider, Content } = Layout;

// const VITE_BASE_PATH_WEB = "http://3.109.198.252";
// const VITE_BASE_PATH_API = "http://3.109.198.252/api";

const VITE_BASE_PATH_WEB = "http://localhost:8080";
const VITE_BASE_PATH_API = "http://10.10.10.17:9101";

const VITE_APP_PEXELS_BASE_PATH = "https://api.pexels.com";
const VITE_APP_PEXELS_KEY =
	"fTBKKibPmBScb8OMT84k2eHqgcPZ8dzJ298bhiY1n40OECYCSj95msoM";

const maxWidth = 1200;
const maxHeight = 700;

const GraphicsEditor: React.FC = () => {
	const canvasRef = useRef<fabric.Canvas | null>(null);

	const [activeTab, setActiveTab] = useState<string>("images");
	const [loadingEditor, setLoadingEditor] = useState<boolean>(true);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [designURL, setDesignURL] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)

	useEffect(() => {
		const init = async () => {
			try {
				setLoadingEditor(true);

				const params = new URLSearchParams(window.location.search);
				const encoded = params.get("data");

				let selectedTemplateIdFromURL: any = null

				if (encoded) {
					const decodedStr = atob(encoded);
					const decodedParams = new URLSearchParams(decodedStr);
					console.log(`decodedParams ===`, decodedParams)

					const returnUrl = decodedParams.get("returnUrl");
					const token = decodedParams.get("token");
					const productId = decodedParams.get("productId");
					selectedTemplateIdFromURL = decodedParams.get("selectedTemplateId");

					if (returnUrl) localStorage.setItem("returnUrl", returnUrl);
					if (token) localStorage.setItem("token", token);
					if (productId) localStorage.setItem("productId", productId);
					if (selectedTemplateIdFromURL) {
						localStorage.setItem("selectedTemplateId", selectedTemplateIdFromURL);
						setSelectedTemplateId(Number(selectedTemplateIdFromURL))
					}

					console.log("Decoded query params:", {
						token,
						productId,
						selectedTemplateId,
					});
				} else {
					message.error("Missing required data in URL.");
					setLoadingEditor(false);
					return;
				}

				canvasRef.current = new fabric.Canvas("editor-canvas", {
					width: maxWidth,
					height: maxHeight,
					backgroundColor: "#ffffff",
					selection: true,
					defaultCursor: "default",
				});

				if (selectedTemplateIdFromURL) {
					await handleLoadRemoteArtwork();
				}
			} catch (error) {
				console.error(error);
				message.error("Failed to initialize editor.");
			} finally {
				setLoadingEditor(false);
			}
		};

		init();
	}, []);

	const handleContinue = () => {
		const dataURL = canvasRef.current?.toDataURL({
			format: "png",
			quality: 1,
		});

		if (dataURL) {
			setDesignURL(dataURL);
			setIsModalVisible(true);
		} else {
			message.error("No design to preview.");
		}
	};

	const handleEditDesign = () => {
		setIsModalVisible(false);
	};

	const handleAddToCart = async () => {
		if (!canvasRef.current) {
			message.error("Canvas is not initialized.");
			return;
		}
	
		setUploading(true);
	
		const hide = message.loading({
			content: "Uploading your design...",
			key: "upload",
			duration: 0,
		});
	
		try {
			// 1. Export SVG string
			const svgString = canvasRef.current.toSVG();
	
			// 2. Convert to File
			const blob = new Blob([svgString], { type: "image/svg+xml" });
			const file = new File([blob], "design.svg", {
				type: "image/svg+xml",
			});
	
			// 3. Upload as FormData
			const formData = new FormData();
			formData.append("file", file);
	
			let headers: any = {};
			let token = localStorage.getItem("token") || "";
			if (token.length) {
				headers = {
					...headers,
					Authorization: `Bearer ${token}`,
				};
			}
	
			const response = await fetch(
				`${VITE_BASE_PATH_API}/v1/upload/artwork`,
				{
					method: "POST",
					headers,
					body: formData,
				}
			);
	
			if (!response.ok) {
				throw new Error("Upload API failed");
			}
	
			const { data } = await response.json();
	
			console.log("Upload successful:", data);
	
			message.success({
				content: "Design uploaded successfully!",
				key: "upload",
			});
	
			const returnUrl = localStorage.getItem("returnUrl") || "";
			const productId = localStorage.getItem("productId") || "";
			const selectedTemplateId =
				localStorage.getItem("selectedTemplateId") || "";
			const dataObj = {
				url: data.url,
				previewUrl: data.previewUrl,
				name: data.name,
				size: data.size,
				mediaType: data.mediaType,
			};
	
			const params = new URLSearchParams();
			params.set("productId", productId);
			params.set("selectedTemplateId", selectedTemplateId);
			params.set("dataObject", JSON.stringify(dataObj));
	
			const encoded = btoa(params.toString());
	
			setIsModalVisible(false);
	
			const separator = returnUrl.includes("?") ? "&" : "?";
			window.location.href = `${returnUrl}${separator}data=${encoded}`;
		} catch (error) {
			console.error(error);
			message.error({
				content: "Failed to upload design.",
				key: "upload",
			});
		} finally {
			hide();
			setUploading(false);
		}
	};

	const handleSave = async () => {
		if (!canvasRef.current) {
			message.error("Canvas is not initialized.");
			return;
		}
	
		setUploading(true);
	
		const hide = message.loading({
			content: "Uploading your design...",
			key: "upload",
			duration: 0,
		});
	
		try {
			// 1. Export SVG string
			const svgString = canvasRef.current.toSVG();
	
			// 2. Convert to File
			const blob = new Blob([svgString], { type: "image/svg+xml" });
			const file = new File([blob], "design.svg", {
				type: "image/svg+xml",
			});
	
			// 3. Upload as FormData
			const formData = new FormData();
			formData.append("file", file);
	
			let headers: any = {};
			let token = localStorage.getItem("token") || "";
			if (token.length) {
				headers = {
					...headers,
					Authorization: `Bearer ${token}`,
				};
			}
	
			const response = await fetch(
				`${VITE_BASE_PATH_API}/v1/upload/artwork`,
				{
					method: "POST",
					headers,
					body: formData,
				}
			);
	
			if (!response.ok) {
				throw new Error("Upload API failed");
			}
	
			const { data } = await response.json();
	
			console.log("Upload successful:", data);
	
			message.loading({
				content: "Design uploaded successfully!",
				key: "upload",
				duration: 0
			});

			const templateCreatePayload = {
				previewUrl: data.previewUrl,
				name: data.name,
				size: data.size,
				mediaType: data.mediaType,
				mediaUrl: data.url
            }

			await fetch(
				`${VITE_BASE_PATH_API}/v1/template/create`,
				{
					method: "POST",
					headers,
					body: JSON.stringify(templateCreatePayload),
				}
			);
	
			message.success({
				content: "Design uploaded successfully!",
				key: "upload",
			});

			const returnUrl = localStorage.getItem("returnUrl") || "";
			window.location.href = `${returnUrl}`;
		} catch (error) {
			console.error(error);
			message.error({
				content: "Failed to upload design.",
				key: "upload",
			});
		} finally {
			hide();
			setUploading(false);
		}
	}

	const addText = () => {
		const text = new fabric.Textbox("Edit me!", {
			left: 100,
			top: 100,
			fontSize: 32,
			editable: true,
			selectable: true,
			evented: true,
		});
		canvasRef.current?.add(text);
		canvasRef.current?.setActiveObject(text);
		canvasRef.current?.requestRenderAll();
	};

	const addImage = (url: string) => {
		fabric.Image.fromURL(url, (img) => {
			img.set({
				left: 50,
				top: 50,
				scaleX: 0.3,
				scaleY: 0.3,
			});
			canvasRef.current?.add(img);
			canvasRef.current?.setActiveObject(img);
			canvasRef.current?.renderAll();
		},
			{
				crossOrigin: "anonymous"
			});
	};

	const handleExport = () => {
		const dataURL = canvasRef.current?.toDataURL({
			format: "png",
			quality: 1,
		});
		if (dataURL) {
			const link = document.createElement("a");
			link.href = dataURL;
			link.download = "design.png";
			link.click();
			message.success("Design exported!");
		}
	};

	const handleUpload = (info: any) => {
		const fileObj = info.file.originFileObj || info.file;
		if (!fileObj) {
			message.error("No file found.");
			return false;
		}
		if (!(fileObj instanceof File)) {
			message.error("Uploaded item is not a valid file.");
			return false;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const dataUrl = e.target?.result as string;
			setUploadedImages((prev) => [...prev, dataUrl]);
		};
		reader.readAsDataURL(fileObj);
		return false;
	};

	const handleSearch = async (page = 1) => {
		if (!searchTerm.trim()) return;

		setLoading(true);
		try {
			const response = await fetch(
				`${VITE_APP_PEXELS_BASE_PATH}/v1/search?query=${encodeURIComponent(
					searchTerm
				)}&per_page=12&page=${page}`,
				{
					headers: {
						Authorization: VITE_APP_PEXELS_KEY,
					},
				}
			);
			const data = await response.json();
			const urls = data.photos.map((photo: any) => photo.src.medium);

			if (page === 1) {
				setSearchResults(urls);
			} else {
				setSearchResults((prev) => [...prev, ...urls]);
			}

			setHasMore(urls.length >= 12);
		} catch (error) {
			console.error(error);
			message.error("Failed to fetch images from Pexels.");
		} finally {
			setLoading(false);
		}
	};

	const renderImageList = (images: string[]) => (
		<List
			grid={{ gutter: 8, column: 2 }}
			dataSource={images}
			renderItem={(url) => (
				<List.Item>
					<Image
						src={url}
						preview={false}
						style={{
							width: "100%",
							cursor: "pointer",
							borderRadius: 4,
							boxShadow: "0 0 4px rgba(0,0,0,0.2)",
						}}
						onClick={() => addImage(url)}
					/>
				</List.Item>
			)}
		/>
	);

	const handleResizeCanvas = (newWidth: number, newHeight: number) => {
		if (canvasRef.current) {
			canvasRef.current.setWidth(newWidth);
			canvasRef.current.setHeight(newHeight);
			canvasRef.current.renderAll();
		}
	};

	const handleLoadRemoteArtwork = async () => {
		try {
			message.loading({
				content: "Fetching template details...",
				key: "convert",
			});

			const token = localStorage.getItem("token");
			const selectedTemplateId = localStorage.getItem("selectedTemplateId");

			if (!selectedTemplateId) {
				message.error({
					content: "Missing template ID.",
					key: "convert",
				});
				return;
			}

			let headers: any = {
				"Content-Type": "application/json",
			};
			if (token) {
				headers = {
					...headers,
					Authorization: `Bearer ${token}`,
				};
			}

			const response = await fetch(
				`${VITE_BASE_PATH_API}/v1/template/list`,
				{
					method: "POST",
					headers,
					body: JSON.stringify({
						filter: {
							templateId: Number(selectedTemplateId),
						},
					}),
				}
			);

			const json = await response.json();

			if (!response.ok || !json?.data?.length) {
				message.error({
					content:
						json?.message || "Failed to fetch template details from server.",
					key: "convert",
				});
				return;
			}

			const templateData = json.data[0];
			const svgUrl = templateData.mediaUrl;

			if (!svgUrl) {
				message.error({
					content: "No mediaUrl found in template response.",
					key: "convert",
				});
				return;
			}

			message.success({
				content: "Template loaded! Importing into canvas...",
				key: "convert",
			});

			fabric.loadSVGFromURL(svgUrl, (objects, options) => {
				const svgWidth = options.width || options.viewBoxWidth || maxWidth;
				const svgHeight = options.height || options.viewBoxHeight || maxHeight;

				const scaleX = maxWidth / svgWidth;
				const scaleY = maxHeight / svgHeight;
				const scale = Math.min(scaleX, scaleY, 1);

				const offsetX = (maxWidth - svgWidth * scale) / 2;
				const offsetY = (maxHeight - svgHeight * scale) / 2;

				canvasRef.current = new fabric.Canvas("editor-canvas", {
					width: maxWidth,
					height: maxHeight,
					backgroundColor: "#ffffff",
					selection: true,
					defaultCursor: "default",
				});

				canvasRef.current?.clear();

				// objects.forEach((obj) => {
				// 	obj.scale(scale);
				// 	obj.set({
				// 		left: (obj.left || 0) * scale + offsetX,
				// 		top: (obj.top || 0) * scale + offsetY,
				// 		selectable: true,
				// 	});
				// 	canvasRef.current?.add(obj);
				// });
				objects.forEach((obj: any) => {
					// Make text editable
					// if (obj instanceof fabric.Text || obj.type === "text" || obj.text?.length) {
					// 	obj.set({
					// 		editable: true,
					// 		selectable: true,
					// 		evented: true,
					// 	});
					// }
					if (obj instanceof fabric.Text && !(obj instanceof fabric.Textbox)) {
						const textbox = new fabric.Textbox(obj.text || "", {
							left: (obj.left || 0) * scale + offsetX,
							top: (obj.top || 0) * scale + offsetY,
							fontSize: obj.fontSize,
							fontFamily: obj.fontFamily,
							fill: obj.fill,
							editable: true,
							selectable: true,
							evented: true,
						});
						obj = textbox;
					}
				
					obj.scale(scale);
					obj.set({
						left: (obj.left || 0) * scale + offsetX,
						top: (obj.top || 0) * scale + offsetY,
						selectable: true,
						evented: true,
					});
				
					canvasRef.current?.add(obj);
				});

				canvasRef.current?.requestRenderAll();
			});
		} catch (error) {
			console.error(error);
			message.error({
				content: "Error loading remote artwork.",
				key: "convert",
			});
		}
	};

	const renderPanel = () => {
		switch (activeTab) {
			case "layers":
				return <LayersPanel canvas={canvasRef.current} />;
			case "images":
				return (
					<>
						<Upload
							showUploadList={false}
							beforeUpload={() => false}
							onChange={handleUpload}
						>
							<Button
								block
								icon={<UploadOutlined />}
								style={{
									marginBottom: 16,
									borderColor: "#452e73",
									color: "#452e73"
								}}
							>
								Upload Image
							</Button>
						</Upload>
						{uploadedImages.length > 0 && (
							<>
								<h3>Uploaded Images</h3>
								{renderImageList(uploadedImages)}
							</>
						)}
						<Divider />
						<h3>Search Images</h3>
						<Input.Search
							placeholder="Search images..."
							enterButton={
								<Button
									icon={<SearchOutlined />}
									style={{ color: "#452e73", borderColor: "#452e73" }}
								/>
							}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onSearch={() => {
								setCurrentPage(1);
								handleSearch(1);
							}}
							style={{ marginBottom: 10 }}
						/>
						{searchResults.length > 0 && !loading && (
							<>
								<h4 style={{ marginTop: 16 }}>Search Results</h4>
								<div
									style={{ height: "80%", overflowY: "auto" }}
									onScroll={(e) => {
										const target = e.target as HTMLElement;
										if (
											target.scrollHeight - target.scrollTop ===
											target.clientHeight &&
											!loading &&
											hasMore
										) {
											const nextPage = currentPage + 1;
											setCurrentPage(nextPage);
											handleSearch(nextPage);
										}
									}}
								>
									{renderImageList(searchResults)}
								</div>
							</>
						)}
					</>
				);
			case "stickers":
				return <StickerPanel onSelect={addImage} />;
			case "text":
				return (
					<>
						<Button
							// type="primary"
							block
							icon={<FontSizeOutlined />}
							onClick={addText}
							style={{
								marginBottom: 16,
								borderColor: "#452e73",
								color: "#452e73"
							}}
						>
							Add New Text
						</Button>
						<TextToolbar canvas={canvasRef.current} />
					</>
				);
			case "shapes":
				return <ShapesPanel canvas={canvasRef.current} />;
			case "canvasSize":
				return <CanvasSizePanel onApplySize={handleResizeCanvas}
					maxWidth={maxWidth}
					maxHeight={maxHeight} />;
			default:
				return null;
		}
	};

	if (loadingEditor) {
		return (
			<Layout
				style={{
					height: "100vh",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div style={{ textAlign: "center" }}>
					<div className="loader" />
					<div style={{ marginTop: 16, fontSize: 16, color: "#1890ff" }}>
						Loading your design...
					</div>
				</div>
				<style>
					{`
            .loader {
              border: 8px solid #f3f3f3;
              border-top: 8px solid #1890ff;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
				</style>
			</Layout>
		);
	}

	return (
		<>
			<Layout style={{ height: "100vh" }}>
				<Sider
					width={180}
					style={{
						background: "#ece9f3",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "flex-start",
						paddingTop: 24,
					}}
				>
					{/* Logo Container */}
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							marginBottom: 30,
						}}
					>
						<img
							src="http://localhost:8080/images/logo.png?t=1751300530"
							alt="Logo"
							style={{
								width: "120px",
								objectFit: "contain",
								display: "block",
							}}
						/>
					</div>

					{/* Menu Container */}
					<div
						style={{
							width: "100%",
							flex: 1,
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Menu
							theme="light"
							mode="inline"
							selectedKeys={[activeTab]}
							onClick={(e) => setActiveTab(e.key)}
							style={{
								width: "100%",
								background: "transparent",
								border: "none",
								flex: 1,
							}}
						>
							<Menu.Item key="images" icon={<FileImageOutlined />}>
								Images
							</Menu.Item>
							<Menu.Item key="stickers" icon={<SmileOutlined />}>
								Stickers & Shapes
							</Menu.Item>
							<Menu.Item key="text" icon={<FontSizeOutlined />}>
								Text
							</Menu.Item>
							<Menu.Item key="layers" icon={<OrderedListOutlined />}>
								Layers
							</Menu.Item>
							<Menu.Item key="canvasSize" icon={<AppstoreAddOutlined />}>
								Canvas Size
							</Menu.Item>
						</Menu>
					</div>

					{/* Back to Website Button */}
					{selectedTemplateId && (
						<div
						style={{
							width: "100%",
							padding: "16px",
							display: "flex",
							justifyContent: "center",
						}}
					>
						<Button
							type="primary"
							block
							style={{
								backgroundColor: "#452e73",
								borderColor: "#452e73",
								color: "#fff",
							}}
							onClick={() => window.history.back()}
						>
							Back to Website
						</Button>
					</div>
					)}
				</Sider>

				<Layout>
					<Sider
						width={320}
						style={{
							background: "#f0f2f5",
							padding: 24,
							overflowY: "auto",
						}}
					>
						{renderPanel()}
					</Sider>
					<Content style={{ padding: 24, background: "#fff" }}>
						<canvas
							id="editor-canvas"
							style={{
								border: "1px solid #e0e0e0",
								boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
								borderRadius: 4,
							}}
						/>
					</Content>
				</Layout>
			</Layout>

			{selectedTemplateId ? (
				<Button
					type="primary"
					style={{
						position: "fixed",
						bottom: 24,
						right: 24,
						zIndex: 1000,
						backgroundColor: "#452e73",
						borderColor: "#452e73",
						color: "#fff",
					}}
					onClick={handleContinue}
				>
					Continue
				</Button>
			) : (
				<Button
					type="primary"
					style={{
						position: "fixed",
						bottom: 24,
						right: 24,
						zIndex: 1000,
						backgroundColor: "#452e73",
						borderColor: "#452e73",
						color: "#fff",
					}}
					onClick={handleSave}
				>
					Save
				</Button>
			)}

			<Modal
				title={<div style={{ fontSize: 20, fontWeight: 600, color: "#452e73" }}>🎨 Design Preview</div>}
				open={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={850}
				bodyStyle={{ padding: "24px 32px" }}
			>
				<div
					style={{
						display: "flex",
						gap: "32px",
						alignItems: "flex-start",
						justifyContent: "space-between",
					}}
				>
					{/* LEFT SECTION */}
					<div
						style={{
							flex: 1,
							textAlign: "center",
							background: "#f9f8fc",
							borderRadius: 8,
							padding: 16,
							border: "1px solid #ddd",
						}}
					>
						{designURL ? (
							<img
								src={designURL}
								alt="Design Preview"
								style={{
									maxWidth: "100%",
									maxHeight: 400,
									borderRadius: 6,
									boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
								}}
							/>
						) : (
							<p>No preview available.</p>
						)}

						<Button
							onClick={handleEditDesign}
							disabled={uploading}
							style={{
								marginTop: 16,
								color: "#452e73",
								borderColor: "#452e73",
							}}
						>
							Edit Design
						</Button>
					</div>

					{/* RIGHT SECTION */}
					<div style={{ flex: 1 }}>
						<h3 style={{ color: "#333", fontSize: 18, marginBottom: 12 }}>
							🚀 Next Steps
						</h3>
						<p style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
							Please review your design. If everything looks good, click the
							<strong> Add to Cart</strong> button below to proceed. Otherwise, use
							the <strong>Edit Design</strong> button to make changes.
						</p>

						<Button
							type="primary"
							onClick={handleAddToCart}
							size="large"
							disabled={uploading}
							style={{
								marginTop: 24,
								background: "#452e73",
								borderColor: "#452e73",
							}}
						>
							Add to Cart
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default GraphicsEditor;
