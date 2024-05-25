import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import locationIcon from "../../assets/UI/location.svg";
import starIcon from "../../assets/UI/star.png";
import ButtonBlue from "../../components/ButtonBlue";
import ButtonOrange from "../../components/ButtonOrange";
import anonymousProfilePicture from "../../assets/UI/anonymous.png";
import { useUser } from "../../contexts/UserContext";
import Unauthorized from "../../components/Unauthorized";
import { useState } from "react";
import InputForm from "../../components/InputForm";
import { postData } from "../../services/api";

const HotelsPageDetail = () => {
	const { id } = useParams();

	const { user } = useUser();

	const [isUnauthorized, setIsUnauthorized] = useState(false);

	const [formData, setFormData] = useState({
		startDate: "",
		day: 1,
	});

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;

		const updatedValue =
			name === "day"
				? value !== ""
					? Math.max(1, parseInt(value, 10))
					: 1
				: value;

		setFormData({
			...formData,
			[name]: updatedValue,
		});
	};

	const { data: hotelDatas, loading: hotelLoading } = useFetch(
		"http://localhost:8080/hotel/getallhotel"
	);

	if (hotelLoading) {
		return <div>Tes</div>;
	}

	const hotelData = hotelDatas.find((hotelData: any) => hotelData.ID == id);

	const handleAddCart = async (room: any) => {
		if (user == null) {
			setIsUnauthorized(true);
		}
		if (formData.startDate == "") {
			alert("Insert start date first");
			return;
		}
		const price = room.pricePreDay * formData.day;
		const userID = user?.ID;
		const roomID = room.ID;
		let startDate = new Date(formData.startDate);
		let endDate = new Date(formData.startDate);
		endDate.setDate(startDate.getDate() + formData.day);

		await postData("http://localhost:8080/roomcart/postroomcart", {
			price,
			userID,
			roomID,
			startDate: startDate.toLocaleDateString(),
			endDate: endDate.toLocaleDateString(),
		});

		alert("Successfully Added to Cart!");
	};

	const handleBookNow = () => {
		if (user == null) {
			setIsUnauthorized(true);
		}
	};

	if (isUnauthorized) {
		return <Unauthorized />;
	}

	return (
		<div className="hotel-detail">
			<div className="header-section">
				<div className="page-center">
					<div className="header-container">
						<p className="title">{hotelData.hotelName}</p>
						<div className="address-container">
							<img src={locationIcon} alt="" />
							<p className="address">{hotelData.address}</p>
						</div>
					</div>
				</div>
			</div>
			<div className="preview-section">
				<div className="page-center">
					<div className="preview-container">
						<div className="left">
							<img src={hotelData.picture} alt="" />
						</div>
						<div className="right">
							<div className="rating-container">
								<div className="rating-header">Rating</div>
								<div className="rating">
									<div className="text">
										{hotelData.Reviews.length == 0
											? "-"
											: hotelData.averageRating + "/10"}
									</div>
									<img src={starIcon} alt="" />
									<div className="text">({hotelData.Reviews.length})</div>
								</div>
							</div>
							<div className="about-hotel-container">
								<p className="about-hotel-header">
									About {hotelData.hotelName}
								</p>
								<p className="about-hotel-body">{hotelData.description}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="facilities-section">
				<div className="page-center">
					<div className="facilites-container">
						<div className="facility-header">Hotel Facilities</div>
						<div className="facility-list">
							{hotelData.HotelFacilities.map((facility: any) => (
								<div className="facility" key={facility.facilityName}>
									{facility.facilityName}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="rooms-section">
				<div className="page-center">
					<div className="rooms-container">
						<div className="rooms-header">
							Available Room Types in {hotelData.hotelName}
						</div>
						<div className="room-list">
							{hotelData.Rooms.map((room: any) => (
								<div className="room" key={room.ID}>
									<div className="left">
										<img src={room.picture} alt="" />
									</div>
									<div className="right">
										<div className="header">{room.roomType}</div>
										<div className="room-facilities-container">
											<div className="room-facility-header">
												Room Facilities
											</div>
											<div className="room-facility-list">
												{room.RoomFacilities.map((roomFacility: any) => (
													<div
														className="room-facility"
														key={roomFacility.facilityName}
													>
														{roomFacility.facilityName}
													</div>
												))}
											</div>
										</div>
										<div className="price-container">
											<InputForm
												label={"Select Start Date"}
												placeHolder={""}
												type={"date"}
												name={"startDate"}
												value={formData.startDate}
												onChange={handleInputChange}
											/>
											<InputForm
												label={"How Many Day"}
												placeHolder={""}
												type={"number"}
												name={"day"}
												value={formData.day}
												onChange={handleInputChange}
											/>
											<div className="price">
												{(room.pricePreDay * formData.day).toLocaleString(
													"id-ID",
													{
														style: "currency",
														currency: "iDR",
													}
												)}
											</div>
											<div className="button-container">
												<div className="button">
													<ButtonBlue
														type={"button"}
														label={"Add to Cart"}
														onClick={() => handleAddCart(room)}
													/>
												</div>
												<div className="button">
													<ButtonOrange
														label={"Book Now!"}
														onClick={handleBookNow}
														type={"button"}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="review-section">
				<div className="page-center">
					<div className="review-container">
						<div className="review-header">Reviews</div>
						{hotelData.Reviews.length == 0 && (
							<div className="no-review">No Review Currently</div>
						)}
						<div className="review-list">
							{hotelData.Reviews.map((review: any) => (
								<div className="review" key={review.ID}>
									<div className="left">
										<div className="username">
											{review.isAnonymous
												? "Anonymous"
												: review.User.profilePicture}
										</div>
										<div className="profile-picture">
											<img
												src={
													review.isAnonymous
														? anonymousProfilePicture
														: review.User.picture
												}
												alt=""
											/>
										</div>
									</div>
									<div className="right">
										<div className="rating">
											{review.rating}/10 {review.type}
										</div>
										<div className="comment">{review.comment}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HotelsPageDetail;
