import { Link } from "react-router-dom";

interface FlightCardProps {
	flightDatas: any;
	disabled?: boolean;
}

function calculateDuration(departureDate: any, arrivalDate: any) {
	const departureTime = new Date(departureDate).getTime();
	const arrivalTime = new Date(arrivalDate).getTime();
	const durationMs = arrivalTime - departureTime;
	const hours = Math.floor(durationMs / (1000 * 60 * 60));
	const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
	return hours + "h " + minutes + "m";
}

const FlightCard: React.FC<FlightCardProps> = ({
	flightDatas,
	disabled = false,
}) => {
	const countAvailableSeat = (seats: any) => {
		let availableSeat = 0;
		seats.forEach((seat: any) => {
			if (!seat.Status) {
				availableSeat++;
			}
		});
		return availableSeat;
	};

	return (
		<div className="flight-card-container">
			{flightDatas.map((flightData: any) => (
				<Link
					to={`/flight/${flightData.ID}`}
					className={`flight-card ${disabled ? "disabled" : ""}`}
					key={flightData.ID}
				>
					<div className="header">
						<div className="airline">
							{flightData.Flights.map((flight: any) => (
								<div key={flight.ID} className="airline-container">
									<img src={flight.Airplane.Airline.Logo} alt="" />
									<p>{flight.Airplane.Airline.AirlineName}</p>
								</div>
							))}
						</div>
						<div className="duration">
							{new Date(flightData.Flights[0].DepartureDate).toLocaleTimeString(
								[],
								{ hour: "2-digit", minute: "2-digit" }
							)}
							-
							{new Date(
								flightData.Flights[flightData.Flights.length - 1].ArrivalDate
							).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							(
							{calculateDuration(
								flightData.Flights[0].DepartureDate,
								flightData.Flights[flightData.Flights.length - 1].ArrivalDate
							)}
							)
						</div>
					</div>
					<div className="body">
						<div className="destination">
							{flightData.Flights.map((flight: any) => (
								<div key={flight.ID} className="destination-container">
									<p className="airplane-code">{flight.Airplane.ID}</p>
									<div className="content">
										<p>
											Origin: {flight.OriginAirport.City.CityName} (
											{flight.OriginAirport.AirportName})
										</p>
										<p>
											Destination: {flight.DestinationAirport.City.CityName} (
											{flight.DestinationAirport.AirportName})
										</p>
										<p>
											Date: {new Date(flight.DepartureDate).toLocaleString()}
										</p>
										<p>Date: {new Date(flight.ArrivalDate).toLocaleString()}</p>
									</div>
									<div className="seat-container">
										<p>Available seat: </p>
										<div className="seat">
											{countAvailableSeat(flight.Airplane.Seats)}/
											{flight.Airplane.Seats.length}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="price-container">
						<div className="price">
							{flightData.Price.toLocaleString("id-ID", {
								style: "currency",
								currency: "iDR",
							})}
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default FlightCard;
