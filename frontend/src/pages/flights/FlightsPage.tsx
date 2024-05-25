import { useEffect, useState } from "react";
import { postData } from "../../services/api";
import FilterRangeInput from "../../components/FilterRangeInput";
import ButtonBlue from "../../components/ButtonBlue";
import FilterRadioButton from "../../components/FilterRadioButton";
import FlightCard from "../../components/FlightCard";

const FlightsPage = () => {
	const [filterFormData, setFilterFormData] = useState({
		minPrice: 0,
		maxPrice: 10000000,
		transit: 0,
		sort: 0,
	});

	const transitItems = [
		{ value: 0, label: "All" },
		{ value: 1, label: "No Transit" },
		{ value: 2, label: "Transit" },
	];

	const sortItems = [
		{ value: 0, label: "None" },
		{ value: 1, label: "Shortest Duration" },
		{ value: 2, label: "Longest Duration" },
		{ value: 3, label: "Lowest Price" },
		{ value: 4, label: "Highest Price" },
		{ value: 5, label: "Fewest Number of Transit" },
		{ value: 6, label: "Most Nuber of Transit" },
	];

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setFilterFormData({
			...filterFormData,
			[name]: value,
		});
	};

	const [flightDatas, setFlightDatas] = useState(null);
	const [flightLoading, setFlightLoading] = useState(true);
	const [fetch, setFetch] = useState(false);

	const getFlightData = async () => {
		setFlightLoading(true);
		setFlightDatas(
			await postData("http://localhost:8080/flight/getflights", {
				minPrice: parseInt(filterFormData.minPrice.toString()),
				maxPrice: parseInt(filterFormData.maxPrice.toString()),
				transit: parseInt(filterFormData.transit.toString()),
				sort: parseInt(filterFormData.sort.toString()),
			})
		);
		setFlightLoading(false);
	};

	useEffect(() => {
		getFlightData();
	}, [fetch]);

	const refetch = () => {
		setFetch(!fetch);
	};

	if (flightLoading) {
		return <div>Loading...</div>;
	}

	console.log(flightDatas);

	return (
		<div className="flights-page">
			<div className="page-center">
				<div className="flight-page-container">
					<div className="side-section">
						<div className="side-container">
							<div className="filter-section">
								<div className="filter-header">
									<div className="title">Filter:</div>
									<div className="reset-button">Reset</div>
								</div>
								<div className="filter-container">
									<div className="filter-price-container">
										<FilterRangeInput
											label={"Price"}
											minValue={filterFormData.minPrice}
											maxValue={filterFormData.maxPrice}
											minName={"minPrice"}
											maxName={"maxPrice"}
											onChange={handleInputChange}
										/>
									</div>
									<div className="filter-transit-container">
										<FilterRadioButton
											label={"Transit"}
											items={transitItems}
											onChange={handleInputChange}
											name={"transit"}
											value={filterFormData.transit}
										/>
									</div>
									<div className="filter-transit-container">
										<FilterRadioButton
											label={"Sort by"}
											items={sortItems}
											onChange={handleInputChange}
											name={"sort"}
											value={filterFormData.sort}
										/>
									</div>
									<div className="filter-button">
										<ButtonBlue
											label={"Filter"}
											onClick={refetch}
											type={"button"}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					{flightDatas != null ? (
						<div className="flights-section">
							<div className="flights-container">
								<FlightCard flightDatas={flightDatas} />
							</div>
						</div>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FlightsPage;
