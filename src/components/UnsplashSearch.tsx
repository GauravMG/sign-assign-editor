import React, { useState } from "react";

interface Props {
	onSelect: (url: string) => void;
}

const UnsplashSearch: React.FC<Props> = ({ onSelect }) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<any[]>([]);

	const handleSearch = async () => {
		const res = await fetch(
			`https://api.unsplash.com/search/photos?query=${query}&per_page=10&client_id=YOUR_UNSPLASH_API_KEY`
		);
		const data = await res.json();
		setResults(data.results);
	};

	return (
		<div style={{ marginBottom: "20px" }}>
			<h3>Search Unsplash</h3>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search images"
			/>
			<button onClick={handleSearch}>Search</button>
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				{results.map((photo) => (
					<img
						key={photo.id}
						src={photo.urls.thumb}
						alt=""
						style={{ width: 100, height: 100, margin: 5, cursor: "pointer" }}
						onClick={() => onSelect(photo.urls.full)}
					/>
				))}
			</div>
		</div>
	);
};

export default UnsplashSearch;
