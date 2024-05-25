import axios from "axios";
import ButtonRed from "../../components/ButtonRed";
import Unauthorized from "../../components/Unauthorized";
import { useUser } from "../../contexts/UserContext";
import useFetch from "../../hooks/useFetch";

const CartPage = () => {
	const { user } = useUser();

	let id;

	console.log(user);

	if (user != null) {
		id = user.ID;
	} else {
		id = 0;
	}

	const {
		data: hotelCartData,
		loading: hotelCartLoading,
		unauthorized,
	} = useFetch(`http://localhost:8080/cart/getallhotelcart/${id}`);

	if (hotelCartLoading) {
		return <div>Loading...</div>;
	}

	if (unauthorized) {
		return <Unauthorized />;
	}

	const handleDelete = async (cartID: any) => {
		console.log("tes");
		await axios.delete(`http://localhost:8080/cart/deletehotelcart/${cartID}`);
		alert("Successfuly remove item");
		window.location.reload();
	};

	console.log(hotelCartData);

	return (
		<div className="cart-page">
			<div className="page-center">
				<div className="cart-item-list">
					{hotelCartData.map((hotelCart: any) => (
						<div className="hotel-item" key={hotelCart.ID}>
							<div className="remove-button">
								<ButtonRed
									label={"Remove"}
									onClick={() => handleDelete(hotelCart.ID)}
									type={"button"}
								/>
							</div>
							<div className="left">
								<img src={hotelCart.Room.picture} alt="" />
							</div>
							<div className="right">
								<div className="header">{hotelCart.Room.roomType}</div>
								<div className="hotel-item-facilities-container">
									<div className="hotel-item-facility-header">
										Room Facilities
									</div>
									<div className="hotel-item-facility-list">
										{hotelCart.Room.RoomFacilities.map(
											(hotelCartFacility: any) => (
												<div
													className="hotel-item-facility"
													key={hotelCartFacility.facilityName}
												>
													{hotelCartFacility.facilityName}
												</div>
											)
										)}
									</div>
								</div>
								<div className="date">
									<div className="start">Start Date: {hotelCart.startDate}</div>
									<div className="end">End Date: {hotelCart.endDate}</div>
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
				</div>
			</div>
		</div>
	);
};

export default CartPage;
