import { useState } from "react";
import useFetch from "../../../hooks/useFetch";

const PromoCarousel = () => {
	const {
		data: promoDatas,
		loading: promoLoading,
		refetch: hotelRefetch,
	} = useFetch(`http://localhost:8080/promo/getactivepromos`);

	const [currentIndex, setCurrentIndex] = useState(0);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === promoDatas.length - 1 ? 0 : prevIndex + 1
		);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? promoDatas.length - 1 : prevIndex - 1
		);
	};

	if (promoLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="promo-carousel">
			<div className="page-center">
				<div className="header">Ongoing Promo</div>
				<div className="carousel-container">
					{promoDatas.map((promo: any, index: number) => (
						<div
							className={`image-container ${
								index === currentIndex ? "active" : ""
							}`}
							key={promo.ID}
						>
							<img src={promo.picture} alt="" />
						</div>
					))}
				</div>
				<button className="prev" onClick={prevSlide}>
					Previous
				</button>
				<button className="next" onClick={nextSlide}>
					Next
				</button>
			</div>
		</div>
	);
};

export default PromoCarousel;
