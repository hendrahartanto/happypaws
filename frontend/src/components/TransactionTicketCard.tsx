import ButtonRed from "./ButtonRed";

interface TransactionTicketCardProps {
	ticketDatas: any;
	checkIfExpired: any;
	handleDelete: any;
	disableDelete?: boolean;
}

const TransactionTicketCard: React.FC<TransactionTicketCardProps> = ({
	ticketDatas,
	checkIfExpired,
	handleDelete,
	disableDelete = false,
}) => {
	return (
		<>
			{ticketDatas.map((ticketCart: any) => (
				<div className="item-2" key={ticketCart.ID}>
					<div
						className={`status ${
							checkIfExpired(ticketCart.Ticket.Flights[0].DepartureDate)
								? ""
								: "expired"
						}`}
					>
						{checkIfExpired(ticketCart.Ticket.Flights[0].DepartureDate)
							? "Ongoing"
							: "Expired"}
					</div>
					{!disableDelete && (
						<div className="remove-button">
							<ButtonRed
								label={"Remove"}
								onClick={() => handleDelete(ticketCart.ID)}
								type={"button"}
							/>
						</div>
					)}
					<div className="header">
						<div className="airline">
							{ticketCart.Ticket.Flights.map((flight: any) => (
								<div key={flight.ID} className="airline-container">
									<img src={flight.Airplane.Airline.Logo} alt="" />
									<p>{flight.Airplane.Airline.AirlineName}</p>
								</div>
							))}
						</div>
						<div className="duration">
							{new Date(
								ticketCart.Ticket.Flights[0].DepartureDate
							).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
							-
							{new Date(
								ticketCart.Ticket.Flights[
									ticketCart.Ticket.Flights.length - 1
								].ArrivalDate
							).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</div>
					</div>
					<div className="body">
						<div className="destination">
							{ticketCart.Ticket.Flights.map((flight: any) => (
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
								</div>
							))}
						</div>
					</div>
					<div className="price-container">
						<div className="price">
							{ticketCart.TotalPrice.toLocaleString("id-ID", {
								style: "currency",
								currency: "iDR",
							})}
						</div>
					</div>
				</div>
			))}
		</>
	);
};

export default TransactionTicketCard;
