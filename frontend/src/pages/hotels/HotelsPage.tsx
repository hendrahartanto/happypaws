import useFetch from "../../hooks/useFetch";
import HotelCard from "./components/HotelCard";

const HotelsPage = () => {
	const { data: hotelDatas, loading: hotelLoading } = useFetch(
		"http://localhost:8080/hotel/getallhotel"
	);

	if (hotelLoading) {
		return <div>Tes</div>;
	}

	return (
		<div className="hotels-page">
			<div className="page-center">
				<div className="side-section">
					<div className="side-container"></div>
				</div>
			</div>

			<div className="hotels-section">
				<div className="page-center">
					<div className="hotels-container">
						<HotelCard hotelDatas={hotelDatas} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default HotelsPage;
