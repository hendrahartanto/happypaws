import axios from "axios";
import Unauthorized from "../../components/Unauthorized";
import { useUser } from "../../contexts/UserContext";
import useFetch from "../../hooks/useFetch";
import Empty from "../../components/Empty";
import ButtonOrange from "../../components/ButtonOrange";
import FormModal from "../../components/FormModal";
import { useEffect, useState } from "react";
import { postData } from "../../services/api";
import TransactionHotelCard from "../../components/TransactionHotelCard";
import TransactionTicketCard from "../../components/TransactionTicketCard";

const CartPage = () => {
	const { user } = useUser();

	const [isUnauthorized, setIsUnauthorized] = useState(false);

	const [modalError, setModalError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const [bookModalIsOpen, setBookModalIsOpen] = useState(false);

	const paymentMethods = [{ id: 0, name: "HI Wallet" }];

	const temp = { id: 1, name: "Credit Card" };

	if (user?.CreditCards.length > 0) {
		paymentMethods.push(temp);
	}

	const inputFormFields = [
		{
			label: "Promo Code",
			name: "promoCode",
			type: "text",
			placeHolder: "Insert promo code",
		},
	];

	const selectFormFields = [
		{
			label: "Select Payment Method",
			name: "paymentMethod",
			options: paymentMethods,
		},
	];

	const [bookFormData, setBookFormData] = useState({
		promoCode: "",
		paymentMethod: 0,
	});

	const bookModalClose = () => {
		setModalError({
			erroeMessage: "",
			isError: false,
		});
		setBookModalIsOpen(false);
	};

	let id;

	if (user != null) {
		id = user.ID;
	} else {
		id = 0;
	}

	const {
		data: hotelCartData,
		loading: hotelCartLoading,
		unauthorized: hotelUnauthorized,
		refetch: hotelRefetch,
	} = useFetch(`http://localhost:8080/cart/getallhotelcart/${id}`);

	const {
		data: ticketCartData,
		loading: ticketCartLoading,
		unauthorized: ticketUnauthorized,
		refetch: ticketRefetch,
	} = useFetch(`http://localhost:8080/cart/getallticketcart/${id}`);

	useEffect(() => {
		if (bookModalIsOpen) {
			document.body.classList.add("unscrollable");
		} else {
			document.body.classList.remove("unscrollable");
		}

		return () => {
			document.body.classList.remove("unscrollable");
		};
	}, [bookModalIsOpen]);

	useEffect(() => {
		ticketRefetch();
		hotelRefetch();
	}, [user]);

	if (hotelCartLoading || ticketCartLoading) {
		return <div>Loading...</div>;
	}

	if (hotelUnauthorized || ticketUnauthorized) {
		return <Unauthorized />;
	}

	const handleDelete = async (cartID: any) => {
		await axios.delete(`http://localhost:8080/cart/deletehotelcart/${cartID}`);
		hotelRefetch();
	};

	const handleDeleteTicket = async (ticketID: any) => {
		await axios.delete(
			`http://localhost:8080/cart/deleteticketcart/${ticketID}`
		);
		ticketRefetch();
	};

	const checkIfExpired = (inputDate: any) => {
		return new Date(inputDate) > new Date();
	};

	const getTotalPrice = () => {
		let totalPrice = 0;
		hotelCartData.forEach((item: any) => {
			totalPrice += item.price;
		});
		ticketCartData.forEach((item: any) => {
			totalPrice += item.TotalPrice;
		});

		return totalPrice;
	};

	const setStatuses = () => {
		hotelCartData.forEach((item: any) => {
			if (checkIfExpired(item.startDate) == true) {
				item.Status = true;
			} else {
				item.Status = false;
			}
		});

		ticketCartData.forEach((item: any) => {
			if (checkIfExpired(item.Ticket.Flights[0].DepartureDate)) {
				item.Status = true;
			} else {
				item.Status = false;
			}
		});
	};

	const handleCheckout = async (modalFormData: any) => {
		console.log(modalFormData);
		setStatuses();
		try {
			await postData(
				"http://localhost:8080/transaction/checkoutcart",
				{
					cartHotels: hotelCartData,
					cartTickets: ticketCartData,
					userID: user?.ID,
					paymentMethod: parseInt(modalFormData.paymentMethod.toString()),
					totalPrice: getTotalPrice(),
					promoCode: modalFormData.promoCode,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
			setModalError({
				isError: true,
				erroeMessage: error.message,
			});
			return;
		}
		setModalError({
			isError: false,
			erroeMessage: "",
		});
		setBookModalIsOpen(false);
		alert("Transaction Success!");
		hotelRefetch();
		ticketRefetch();
	};

	if (hotelCartData.length == 0 && ticketCartData.length == 0) {
		return <Empty label="Cart is empty..." />;
	}

	return (
		<div className="cart-page">
			<FormModal
				isOpen={bookModalIsOpen}
				onSubmit={handleCheckout}
				inputFormFields={inputFormFields}
				modalFormData={bookFormData}
				title="Checkout Details"
				bookPrice={getTotalPrice()}
				onClose={bookModalClose}
				selectFormFields={selectFormFields}
				modalError={modalError}
			/>
			<div className="page-center">
				<div className="cart-item-list">
					<TransactionHotelCard
						hotelDatas={hotelCartData}
						checkIfExpired={checkIfExpired}
						handleDelete={handleDelete}
						refetch={hotelRefetch}
					/>
					<TransactionTicketCard
						ticketDatas={ticketCartData}
						checkIfExpired={checkIfExpired}
						handleDelete={handleDeleteTicket}
					/>
					<div className="bottom-section">
						<div className="price-container">
							<div className="price-label">Total</div>
							<div className="price">
								{getTotalPrice().toLocaleString("id-ID", {
									style: "currency",
									currency: "iDR",
								})}
							</div>
						</div>
						<div className="button">
							<ButtonOrange
								label={"Check Out"}
								onClick={() => setBookModalIsOpen(true)}
								type={"button"}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
