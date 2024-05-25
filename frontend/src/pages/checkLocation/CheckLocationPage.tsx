import React, { useState } from "react";

const CheckLocationPage: React.FC = () => {
	const [prediction, setPrediction] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			sendImage(file);
		}
	};

	const label = [
		"Brazil",
		"Canada",
		"Finland",
		"Japan",
		"United-Kingdom",
		"United-States",
	];

	const sendImage = async (file: File) => {
		const formData = new FormData();
		formData.append("image", file);

		try {
			const response = await fetch("http://localhost:9999/predict", {
				method: "POST",
				body: formData,
			});
			const data = await response.json();
			if ("prediction" in data) {
				setPrediction(label[data.prediction - 1]);
				setError(null);
			} else if ("error" in data) {
				setError(data.error);
				setPrediction(null);
			}
		} catch (error) {
			console.error("Error:", error);
			setError("An error occurred while processing the request.");
			setPrediction(null);
		}
	};

	return (
		<div className="check-location-page">
			<div className="page-center">
				<h1>Image Prediction</h1>
				<input type="file" accept="image/*" onChange={handleImageChange} />
				{prediction !== null && (
					<div>
						<p>Prediction: {prediction}</p>
					</div>
				)}
				{error && <p>Error: {error}</p>}
			</div>
		</div>
	);
};

export default CheckLocationPage;
