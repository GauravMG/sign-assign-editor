import React, { useState } from "react";
import { Upload, Button, Input, List, Image, message, Spin } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { fabric } from "fabric";

interface Props {
	canvas: fabric.Canvas | null;
}

const PEXELS_API_KEY = "YOUR_PEXELS_API_KEY";

const ImageToolbar: React.FC<Props> = ({ canvas }) => {
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const addImageToCanvas = (url: string) => {
		fabric.Image.fromURL(url, (img) => {
			img.set({
				left: 50,
				top: 50,
				scaleX: 0.3,
				scaleY: 0.3,
			});
			canvas?.add(img);
			canvas?.setActiveObject(img);
			canvas?.renderAll();
			message.success("Image added to canvas!");
		},
		{
		  crossOrigin: "anonymous"
		});
	};

	const handleUpload = (info: any) => {
		if (info.file.status !== "uploading") {
			const file = info.file.originFileObj;
			const reader = new FileReader();
			reader.onload = (e) => {
				const dataUrl = e.target?.result as string;
				setUploadedImages((prev) => [...prev, dataUrl]);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSearch = async () => {
		if (!searchTerm.trim()) return;

		setLoading(true);
		try {
			const response = await fetch(
				`https://api.pexels.com/v1/search?query=${encodeURIComponent(
					searchTerm
				)}&per_page=10`,
				{
					headers: {
						Authorization: "fTBKKibPmBScb8OMT84k2eHqgcPZ8dzJ298bhiY1n40OECYCSj95msoM",
					},
				}
			);
			const data = await response.json();
			const urls = data.photos.map((photo: any) => photo.src.medium);
			setSearchResults(urls);
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
						onClick={() => addImageToCanvas(url)}
					/>
				</List.Item>
			)}
		/>
	);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{/* Uploaded Images Section */}
			<div>
				<Upload
					showUploadList={false}
					beforeUpload={() => false}
					onChange={handleUpload}
				>
					<Button block icon={<UploadOutlined />}>
						Upload Image
					</Button>
				</Upload>
				{uploadedImages.length > 0 && (
					<div style={{ marginTop: 8 }}>
						<h4 style={{ marginBottom: 8 }}>Uploaded Images</h4>
						{renderImageList(uploadedImages)}
					</div>
				)}
			</div>

			{/* Search Section */}
			<div>
				<Input.Search
					placeholder="Search images..."
					enterButton={<SearchOutlined />}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onSearch={handleSearch}
				/>
				{loading && <Spin style={{ marginTop: 16 }} />}
				{searchResults.length > 0 && !loading && (
					<div style={{ marginTop: 8 }}>
						<h4 style={{ marginBottom: 8 }}>Search Results</h4>
						{renderImageList(searchResults)}
					</div>
				)}
			</div>

			{/* Filter Buttons */}
			<div style={{ marginTop: 16 }}>
				<Button
					style={{ marginRight: 8 }}
					onClick={() => applyFilter("grayscale")}
				>
					Grayscale
				</Button>
				<Button
					style={{ marginRight: 8 }}
					onClick={() => applyFilter("sepia")}
				>
					Sepia
				</Button>
				<Button onClick={() => applyFilter("invert")}>
					Invert
				</Button>
			</div>
		</div>
	);

	function applyFilter(type: string) {
		const active = canvas?.getActiveObject();
		if (active && active.type === "image") {
			const img = active as fabric.Image;
			let filter;
			switch (type) {
				case "grayscale":
					filter = new fabric.Image.filters.Grayscale();
					break;
				case "sepia":
					filter = new fabric.Image.filters.Sepia();
					break;
				case "invert":
					filter = new fabric.Image.filters.Invert();
					break;
				default:
					return;
			}
			img.filters?.push(filter!);
			img.applyFilters();
			canvas.requestRenderAll();
		}
	}
};

export default ImageToolbar;
