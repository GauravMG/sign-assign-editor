import React, { useState, useEffect, useRef } from "react";
import {
	SearchOutlined
} from "@ant-design/icons";
import { Input, Spin, Empty, Button } from "antd";

interface Props {
	onSelect: (url: string) => void;
}

// const VITE_APP_ICONIFY_BASE_PATH = process.env.VITE_APP_ICONIFY_BASE_PATH as string || import.meta.env.VITE_APP_ICONIFY_BASE_PATH as string
const VITE_APP_ICONIFY_BASE_PATH = "https://api.iconify.design"

const StickerPanel: React.FC<Props> = ({ onSelect }) => {
	const [query, setQuery] = useState("");
	const [icons, setIcons] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [hasMore, setHasMore] = useState(true);

	const fetchIcons = async (reset = false) => {
		if (loading) return;

		setLoading(true);

		try {
			const res = await fetch(
				`${VITE_APP_ICONIFY_BASE_PATH}/search?query=${encodeURIComponent(query)}&limit=999&offset=${reset ? 0 : offset}`
			);
			const data = await res.json();

			if (data.icons && Array.isArray(data.icons)) {
				const newIcons = data.icons.filter((id) => typeof id === "string");

				if (reset) {
					setIcons(newIcons);
					setOffset(999);
				} else {
					setIcons((prev) => [...prev, ...newIcons]);
					setOffset((prev) => prev + 999);
				}

				if (newIcons.length < 999) {
					setHasMore(false);
				}
			} else {
				if (reset) setIcons([]);
				setHasMore(false);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (query.trim() !== "") {
			fetchIcons(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	const handleScroll = () => {
		// const div = containerRef.current;
		// if (!div || loading || !hasMore) return;

		// if (div.scrollTop + div.clientHeight >= div.scrollHeight - 50) {
		// 	fetchIcons();
		// }
	};

	useEffect(() => {
		const div = containerRef.current;
		if (div) {
			div.addEventListener("scroll", handleScroll);
			return () => div.removeEventListener("scroll", handleScroll);
		}
	}, [loading, hasMore]);

	const getIconUrl = (iconId: string) => {
		// Return SVG URL
		return `${VITE_APP_ICONIFY_BASE_PATH}/${iconId}.svg`;
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Input.Search
				placeholder="Search stickers or shapes..."
				enterButton={
					<Button
						icon={<SearchOutlined />}
						style={{ color: "#452e73", borderColor: "#452e73" }}
					/>
				}
				onSearch={(val) => {
					setQuery(val || "");
					setHasMore(true);
				}}
				style={{ marginBottom: 10 }}
				allowClear
				defaultValue={query}
			/>

			<div
				ref={containerRef}
				style={{
					overflowY: "auto",
					flexGrow: 1,
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
					gap: 10,
				}}
			>
				{icons.map((iconId) => (
					<img
						key={iconId}
						src={getIconUrl(iconId)}
						alt={iconId}
						style={{ width: 50, height: 50, cursor: "pointer" }}
						onClick={() => onSelect(getIconUrl(iconId))}
					/>
				))}

				{!loading && icons.length === 0 && (
					<Empty description="No icons found" style={{ gridColumn: "1 / -1" }} />
				)}

				{loading && (
					<div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 10 }}>
						<Spin />
					</div>
				)}
			</div>
		</div>
	);
};

export default StickerPanel;
