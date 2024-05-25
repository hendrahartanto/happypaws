import { useState } from "react";
import ButtonRed from "./ButtonRed";
import InputForm from "./InputForm";
import ButtonOrange from "./ButtonOrange";
import { postData, updateData } from "../services/api";
import { useUser } from "../contexts/UserContext";
import ButtonBlue from "./ButtonBlue";

interface TransactionHotelCardProps {
	hotelDatas: any;
	checkIfExpired: any;
	handleDelete: any;
	disableDelete?: boolean;
	refetch?: any;
}

const TransactionHotelCard: React.FC<TransactionHotelCardProps> = ({
	hotelDatas,
	checkIfExpired,
	handleDelete,
	disableDelete = false,
	refetch,
}) => {
	const [error, setError] = useState({
		isError: false,
		erroeMessage: "",
	});
	const { user } = useUser();

	const [formData, setFormData] = useState({
		startDate: "",
		endDate: "",
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

	const handleUpdate = async (roomCart: any) => {
		if (formData.startDate == "" || formData.endDate == "") {
			alert("Insert date first");
			return;
		}
		const userID = user?.ID;
		const roomID = roomCart.Room.ID;
		const startDate = new Date(formData.startDate).toISOString();
		const endDate = new Date(formData.endDate).toISOString();
		console.log(startDate);
		try {
			await updateData(
				"http://localhost:8080/cart/updateroomcart",
				{
					userID,
					roomID,
					startDate: startDate,
					endDate: endDate,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			setError({
				isError: true,
				erroeMessage: error.message,
			});
			return;
		}
		setError({
			isError: false,
			erroeMessage: "",
		});
		refetch();
		alert("Successfully Added to Cart!");
	};

	console.log(hotelDatas);

	return (
		<>
			{hotelDatas.map((hotelCart: any) => (
				<div className="item" key={hotelCart.ID}>
					<div
						className={`status ${
							checkIfExpired(hotelCart.startDate) ? "" : "expired"
						}`}
					>
						{checkIfExpired(hotelCart.startDate) ? "Ongoing" : "Expired"}
					</div>
					{!disableDelete && (
						<div className="remove-button">
							<ButtonRed
								label={"Remove"}
								onClick={() => handleDelete(hotelCart.ID)}
								type={"button"}
							/>
						</div>
					)}
					<div className="left">
						<img src={hotelCart.Room.picture} alt="" />
					</div>
					<div className="right">
						<div className="header">{hotelCart.Room.roomType}</div>
						<div className="hotel-item-facilities-container">
							<div className="hotel-item-facility-header">Room Facilities</div>
							<div className="hotel-item-facility-list">
								{hotelCart.Room.RoomFacilities.map((hotelCartFacility: any) => (
									<div
										className="hotel-item-facility"
										key={hotelCartFacility.facilityName}
									>
										{hotelCartFacility.facilityName}
									</div>
								))}
							</div>
						</div>
						<div className="date">
							<div className="start">
								Start Date: {new Date(hotelCart.startDate).toLocaleString()}
							</div>
							<div className="end">
								End Date: {new Date(hotelCart.endDate).toLocaleString()}
							</div>
						</div>
						<div className="update-date">
							<p className="update-date-header">Update Date</p>
							<div className="input-container">
								<InputForm
									label={"Select Start Date"}
									placeHolder={""}
									type={"datetime-local"}
									name={"startDate"}
									value={formData.startDate}
									onChange={handleInputChange}
								/>
								<InputForm
									label={"Select End Date"}
									placeHolder={""}
									type={"datetime-local"}
									name={"endDate"}
									value={formData.endDate}
									onChange={handleInputChange}
								/>
							</div>
							{error.isError && (
								<div className="error">{error.erroeMessage}</div>
							)}
							<div className="update-button">
								<ButtonBlue
									label={"Update"}
									onClick={() => handleUpdate(hotelCart)}
									type={"button"}
								/>
							</div>
						</div>
						<div className="price-container">
							<div className="price">
								{hotelCart.price.toLocaleString("id-ID", {
									style: "currency",
									currency: "iDR",
								})}
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
};

export default TransactionHotelCard;
