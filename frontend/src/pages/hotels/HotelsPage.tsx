import { useEffect, useState } from "react";
import FilterRangeSlider from "../../components/FilterRangeSlider";
import HotelCard from "./components/HotelCard";
import starIcon from "../../assets/UI/star.png";
import { postData } from "../../services/api";
import ButtonBlue from "../../components/ButtonBlue";
import FilterCheckbox from "../../components/FilterCheckbox";
import FilterRangeInput from "../../components/FilterRangeInput";
import FilterRadioButton from "../../components/FilterRadioButton";

const HotelsPage = () => {
	const [filterFormData, setFilterFormData] = useState({
		minRating: 0,
		maxRating: 10,
		minPrice: 0,
		maxPrice: 10000000,
		sort: 0,
	});

	const [filterFacilities, setFilterFacilities] = useState({
		AC: false,
		"Swimming Pool": false,
		Parking: false,
		Elevator: false,
		WiFi: false,
		"24-Hour Front Desk": false,
		Restaurant: false,
	});

	const [hotelDatas, setHotelDatas] = useState(null);
	const [hotelLoading, sethotelLoading] = useState(true);
	const [fetch, setFetch] = useState(false);

	const sortItems = [
		{ value: 0, label: "None" },
		{ value: 1, label: "Lowest Price" },
		{ value: 2, label: "Highest Price" },
		{ value: 3, label: "Highest Rating" },
		{ value: 4, label: "Lowest Number of Reviews" },
		{ value: 5, label: "Highest Number of Reviews" },
	];

	const getHotelData = async () => {
		sethotelLoading(true);
		const facilities = Object.entries(filterFacilities)
			.filter(([_, isChecked]) => isChecked)
			.map(([option]) => option);
		setHotelDatas(
			await postData("http://localhost:8080/hotel/gethotels", {
				minRating: filterFormData.minRating,
				maxRating: filterFormData.maxRating,
				facilities,
				minPrice: parseInt(filterFormData.minPrice.toString()),
				maxPrice: parseInt(filterFormData.maxPrice.toString()),
				sort: parseInt(filterFormData.sort.toString()),
			})
		);
		sethotelLoading(false);
	};

	useEffect(() => {
		getHotelData();
	}, [fetch]);

	const resetFilterFormData = () => {
		setFilterFormData({
			minRating: 0,
			maxRating: 10,
			minPrice: 0,
			maxPrice: 10000000,
			sort: 0,
		});
		setFilterFacilities({
			AC: false,
			"Swimming Pool": false,
			Parking: false,
			Elevator: false,
			WiFi: false,
			"24-Hour Front Desk": false,
			Restaurant: false,
		});
		refetch();
	};

	const handleSliderChange = (e: any) => {
		const { name, value } = e.target;

		if (name.includes("min")) {
			setFilterFormData({
				...filterFormData,
				minRating: Math.min(parseInt(value), filterFormData.maxRating),
			});
		} else if (name.includes("max")) {
			setFilterFormData({
				...filterFormData,
				maxRating: Math.max(parseInt(value), filterFormData.minRating),
			});
		}
	};

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setFilterFormData({
			...filterFormData,
			[name]: value,
		});
	};

	const handleFilterFacilitiesChange = (e: any) => {
		const { name, checked } = e.target;
		setFilterFacilities({ ...filterFacilities, [name]: checked });
	};

	const refetch = () => {
		setFetch(!fetch);
	};

	if (hotelLoading) {
		return <div>Loading...</div>;
	}

	console.log(hotelDatas);

	return (
		<div className="hotels-page">
			<div className="page-center">
				<div className="hotel-page-container">
					<div className="side-section">
						<div className="side-container">
							<div className="filter-section">
								<div className="filter-header">
									<div className="title">Filter:</div>
									<div onClick={resetFilterFormData} className="reset-button">
										Reset
									</div>
								</div>
								<div className="filter-container">
									<div className="filter-rating-container">
										<FilterRangeSlider
											minValue={filterFormData.minRating}
											maxValue={filterFormData.maxRating}
											min={0}
											max={10}
											onChange={handleSliderChange}
											minName={"minRating"}
											maxName={"maxRating"}
											label="Rating"
											icon={starIcon}
										/>
									</div>
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
									<div className="filter-facilities-container">
										<FilterCheckbox
											label="Hotel Facilities"
											filterItems={filterFacilities}
											handleChange={handleFilterFacilitiesChange}
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
					{hotelDatas != null ? (
						<div className="hotels-section">
							<div className="page-center">
								<div className="hotels-container">
									<HotelCard hotelDatas={hotelDatas} />
								</div>
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

export default HotelsPage;
