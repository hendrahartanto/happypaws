import { useEffect, useState } from "react";
import { postData } from "../../services/api";
import Unauthorized from "../../components/Unauthorized";
import { useUser } from "../../contexts/UserContext";
import ButtonBlue from "../../components/ButtonBlue";
import FilterRadioButton from "../../components/FilterRadioButton";

const MyBookingPage = () => {
	const [hotelTransactionDatas, setHotelTransactionDatas] = useState<any>(null);
	const [hotelTransactionLoading, setHotelTransactionLoading] = useState(true);
	const [ticketTransactionDatas, setTicketTransactionDatas] =
		useState<any>(null);
	const [ticketTransactionLoading, setTicketTransactionLoading] =
		useState(true);
	const [unaithorized, setIsUnauthorized] = useState(false);
	const [fetch, setFetch] = useState(false);

	const { user } = useUser();

	const [type, setType] = useState(0);

	const typeItems = [
		{ value: 0, label: "All" },
		{ value: 1, label: "Hotel" },
		{ value: 2, label: "Flight" },
	];

	const handleChange = (e: any) => {
		setType(e.target.value);
	};

	const getHotelTransactionDatas = async () => {
		setHotelTransactionLoading(true);
		try {
			setHotelTransactionDatas(
				await postData(
					"http://localhost:8080/transaction/getongoinghoteltransactions",
					{ userID: user?.ID },
					{ withCredentials: true }
				)
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				setHotelTransactionLoading(false);
				return;
			}
		}
		setHotelTransactionLoading(false);
	};

	const getTicketTransactionDatas = async () => {
		setTicketTransactionLoading(true);
		try {
			setTicketTransactionDatas(
				await postData(
					"http://localhost:8080/transaction/getongoingtickettransactions",
					{ userID: user?.ID },
					{ withCredentials: true }
				)
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				setTicketTransactionLoading(false);
				return;
			}
		}
		setTicketTransactionLoading(false);
	};

	useEffect(() => {
		setTicketTransactionDatas(null);
		setHotelTransactionDatas(null);
		if (type == 0) {
			getHotelTransactionDatas();
			getTicketTransactionDatas();
		} else if (type == 1) {
			getHotelTransactionDatas();
		} else {
			getTicketTransactionDatas();
		}
	}, [fetch, user]);

	const refetch = () => {
		setFetch(!fetch);
	};

	if (hotelTransactionLoading || ticketTransactionLoading) {
		return <div>Loading...</div>;
	}

	if (unaithorized) {
		return <Unauthorized />;
	}

	console.log(hotelTransactionDatas);
	console.log(ticketTransactionDatas);

	return (
		<div className="my-booking-page">
			<div className="page-center">
				<div className="my-booking-page-container">
					<div className="side-section">
						<div className="side-container">
							<div className="filter-section">
								<div className="filter-header">
									<div className="title">Filter:</div>
									<div className="reset-button">Reset</div>
								</div>
								<div className="filter-container">
									<div className="filter-type-container">
										<FilterRadioButton
											label={"Transit"}
											items={typeItems}
											onChange={handleChange}
											name={"transit"}
											value={type}
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
					<div className="item-container">
						{hotelTransactionDatas != null ? (
							<div className="hotels-section">
								<div className="hotels-container">
									{hotelTransactionDatas.map((hotel: any) => (
										<div className="item">
											<div
												className={`status ${hotel.Status ? "" : "expired"}`}
											>
												{hotel.Status ? "Booked" : "Expired"}
											</div>
											<div className="left">
												<img src={hotel.Room.picture} alt="" />
											</div>
											<div className="right">
												<div className="header">{hotel.Room.roomType}</div>
												<div className="hotel-item-facilities-container">
													<div className="hotel-item-facility-header">
														Room Facilities
													</div>
													<div className="hotel-item-facility-list">
														{hotel.Room.RoomFacilities.map(
															(hotelFacility: any) => (
																<div
																	className="hotel-item-facility"
																	key={hotelFacility.facilityName}
																>
																	{hotelFacility.facilityName}
																</div>
															)
														)}
													</div>
												</div>
												<div className="date">
													<div className="start">
														Start Date:{" "}
														{new Date(hotel.CheckInDate).toLocaleString()}
													</div>
													<div className="end">
														End Date:{" "}
														{new Date(hotel.CheckOutDate).toLocaleString()}
													</div>
												</div>
												<div className="price-container">
													<div className="price">
														{hotel.Price.toLocaleString("id-ID", {
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
						) : (
							<div></div>
						)}
						{ticketTransactionDatas != null ? (
							<div className="hotels-section">
								<div className="hotels-container">
									{ticketTransactionDatas.map((ticket: any) => (
										<div className="item-2" key={ticket.ID}>
											<div
												className={`status ${ticket.Status ? "" : "expired"}`}
											>
												{ticket.Status ? "Booked" : "Expired"}
											</div>
											<div className="header">
												<div className="airline">
													{ticket.Ticket.Flights.map((flight: any) => (
														<div key={flight.ID} className="airline-container">
															<img src={flight.Airplane.Airline.Logo} alt="" />
															<p>{flight.Airplane.Airline.AirlineName}</p>
														</div>
													))}
												</div>
												<div className="duration">
													{new Date(
														ticket.Ticket.Flights[0].DepartureDate
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
													-
													{new Date(
														ticket.Ticket.Flights[
															ticket.Ticket.Flights.length - 1
														].ArrivalDate
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</div>
											</div>
											<div className="body">
												<div className="destination">
													{ticket.Ticket.Flights.map((flight: any) => (
														<div
															key={flight.ID}
															className="destination-container"
														>
															<p className="airplane-code">
																{flight.Airplane.ID}
															</p>
															<div className="content">
																<p>
																	Origin: {flight.OriginAirport.City.CityName} (
																	{flight.OriginAirport.AirportName})
																</p>
																<p>
																	Destination:{" "}
																	{flight.DestinationAirport.City.CityName} (
																	{flight.DestinationAirport.AirportName})
																</p>
																<p>
																	Date:{" "}
																	{new Date(
																		flight.DepartureDate
																	).toLocaleString()}
																</p>
																<p>
																	Date:{" "}
																	{new Date(
																		flight.ArrivalDate
																	).toLocaleString()}
																</p>
															</div>
														</div>
													))}
													<div className="price-container">
														<div className="price">
															{ticket.TotalPrice.toLocaleString("id-ID", {
																style: "currency",
																currency: "iDR",
															})}
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						) : (
							<div></div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyBookingPage;
