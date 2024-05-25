import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import FlightCard from "../../components/FlightCard";
import { ChangeEvent, useState } from "react";
import InputForm from "../../components/InputForm";
import ButtonBlue from "../../components/ButtonBlue";
import ButtonOrange from "../../components/ButtonOrange";
import { postData } from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import Unauthorized from "../../components/Unauthorized";

interface Seat {
	id: number;
	status: boolean;
}

interface SeatSelectionProps {
	seats: Seat[];
	onChange: any;
	airplaneId: any;
	quantity: number;
}

function SeatSelection({
	seats,
	onChange,
	airplaneId,
	quantity,
}: SeatSelectionProps) {
	const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

	const toggleSeatSelection = (seatId: number) => {
		if (selectedSeats.includes(seatId)) {
			setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
			setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
			onChange(seatId, airplaneId);
		} else {
			if (selectedSeats.length < quantity) {
				onChange(seatId, airplaneId);
				setSelectedSeats([...selectedSeats, seatId]);
			} else {
				alert(`You can only select up to ${quantity} seats.`);
			}
		}
	};

	return (
		<div className="seat-selection-inner-container">
			<div className="seat-selection-container-header"></div>
			<div className="seat-map-container">
				{seats.map((seat) => (
					<div className="seat" key={seat.id}>
						<div className="pop-up">
							<p>Seat: {seat.id}</p>
							<p>Status: {seat.status ? "Occupied" : "Unoccupied"}</p>
						</div>
						<input
							className={seat.status ? "booked" : ""}
							type="checkbox"
							checked={selectedSeats.includes(seat.id)}
							onChange={() => toggleSeatSelection(seat.id)}
						/>
					</div>
				))}
			</div>
			<div className="selected-seat">
				Selected Seats: {selectedSeats.join(", ")}
			</div>
		</div>
	);
}

const FlightDetailPage = () => {
	const [error, setError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const [unaithorized, setIsUnauthorized] = useState(false);

	const { id } = useParams();

	const { user } = useUser();

	const { data: flightData, loading: flightLoading } = useFetch(
		`http://localhost:8080/flight/getflightbyid/${id}`
	);

	const [allSelectedSeats, setAllSelectedSeats] = useState<
		{ [key: string]: string }[]
	>([]);

	const [formData, setFormData] = useState({
		quantity: 1,
		luggage: false,
	});

	console.log(allSelectedSeats);

	const toggleSeatSelection = (seatId: any, airplaneId: any) => {
		const selectedIndex = allSelectedSeats.findIndex(
			(seat) => seat.airplaneId == airplaneId && seat.seatId == seatId
		);

		if (selectedIndex != -1) {
			setAllSelectedSeats((prevSeats) => {
				const updatedSeats = [...prevSeats];
				updatedSeats.splice(selectedIndex, 1);
				return updatedSeats;
			});
		} else {
			setAllSelectedSeats((prevSeats) => [
				...prevSeats,
				{ airplaneId, seatId },
			]);
		}
	};

	const handleInputChange = (e: any) => {
		const { name, value, type, checked } = e.target;

		let inputValue = type === "checkbox" ? checked : value;

		if (name === "quantity" && inputValue < 1) {
			inputValue = 1;
		}

		setFormData({
			...formData,
			[name]: inputValue,
		});
	};

	const handleAddToCart = async () => {
		const airplaneIDs = allSelectedSeats.map((item) => item.airplaneId);
		const seatIDs = allSelectedSeats.map((item) => parseInt(item.seatId));
		try {
			await postData(
				"http://localhost:8080/cart/postticketcart",
				{
					userID: user?.ID,
					ticketID: flightData.ID,
					totalPrice: flightData.Price * formData.quantity,
					quantity: parseInt(formData.quantity.toString()),
					seatNumbers: seatIDs,
					airplaneCodes: airplaneIDs,
					flightNum: flightData.Flights.length,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
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

		alert("Successfully added to cart!");
	};

	const handleBookNow = () => {};

	if (flightLoading) {
		return <div>Loading...</div>;
	}

	if (unaithorized) {
		return <Unauthorized />;
	}

	let seatsData = [[]];

	flightData.Flights.forEach((flight: any, index: any) => {
		seatsData[index] = flightData.Flights[index].Airplane.Seats.map(
			(seat: any) => ({
				id: seat.SeatNumber.toString(),
				status: seat.Status,
			})
		);
	});

	console.log(flightData);

	const temp = [flightData];

	return (
		<div className="flight-detail-page">
			<div className="page-center">
				<div className="flight-detail-page-container">
					<div className="flight-detail-page-header">Your Booking</div>
					<div className="flight-card-container">
						<FlightCard flightDatas={temp} disabled={true} />
					</div>
					<div className="booking-detail-section">
						<div className="booking-detail-header">Booking Details</div>
						<form className="booking-detail-container">
							<InputForm
								label={"Ticket Quantity"}
								placeHolder={"Insert ticket quantity"}
								type={"number"}
								name={"quantity"}
								value={formData.quantity}
								onChange={handleInputChange}
							/>
							<InputForm
								label={"Add Luggage"}
								placeHolder={""}
								type={"checkbox"}
								name={"luggage"}
								value={formData.luggage}
								onChange={handleInputChange}
							/>
							<div className="price-container">
								<div className="price">
									{(flightData.Price * formData.quantity).toLocaleString(
										"id-ID",
										{
											style: "currency",
											currency: "iDR",
										}
									)}
								</div>
							</div>
							<div className="button-container">
								<div className="button">
									<ButtonBlue
										label={"Add to Cart"}
										onClick={handleAddToCart}
										type={"button"}
									/>
								</div>
								<div className="button">
									<ButtonOrange
										label={"Book Now!"}
										onClick={undefined}
										type={"button"}
									/>
								</div>
							</div>
							{error.isError && (
								<div className="error">{error.erroeMessage}</div>
							)}
						</form>
					</div>
					<div className="seat-selection-section">
						<div className="seat-selection-header">Seat Selection</div>
						{flightData.Flights.map((flight: any, index: number) => (
							<div className="seat-selection-container" key={flight.ID}>
								<div className="airplane-code">{flight.Airplane.ID}</div>
								<SeatSelection
									seats={seatsData[index]}
									onChange={toggleSeatSelection}
									airplaneId={flight.Airplane.ID}
									quantity={parseInt(formData.quantity.toString())}
								></SeatSelection>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FlightDetailPage;
