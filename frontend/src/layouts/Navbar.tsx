import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarMenu from "./components/NavbarMenu";
import ButtonLink from "../components/ButtonLink";
import homeIcon from "../assets/UI/home-alt.svg";
import myticketIcon from "../assets/UI/myticket.svg";
import flightIcon from "../assets/UI/flight.svg";
import hotelIcon from "../assets/UI/hotel.svg";
import hamburgerIcon from "../assets/UI/hamburger.svg";
import loginIcon from "../assets/UI/login.svg";
import paymentIcon from "../assets/UI/payment.svg";
import cartIcon from "../assets/UI/cart.svg";
import { useUser } from "../contexts/UserContext";
import anonymousProfilePicture from "../assets/UI/anonymous.png";
import useFetch from "../hooks/useFetch";

export default function Navbar() {
	const { login, logout } = useUser();
	const { data: currUser, loading: currUserloading } = useFetch(
		`http://localhost:8080/user/validate?${location.pathname}`
	);

	const [isOpen, setIsOpen] = useState(false);

	const openSidebar = () => {
		setIsOpen(true);
	};

	const closeSidebar = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (currUser) {
			login(currUser);
		} else {
			logout();
		}
	}, [currUser, login, logout]);

	if (currUserloading) {
		return <div>Loading</div>;
	}

	console.log(currUser);

	const sidebarData = [
		{
			title: "Home",
			path: "/home",
			icon: homeIcon,
		},
		{
			title: "My Booking",
			path: "/mybooking",
			icon: myticketIcon,
		},
		{
			title: "Flights",
			path: "/flights",
			icon: flightIcon,
		},
		{
			title: "Hotels",
			path: "/hotels",
			icon: hotelIcon,
		},
		{
			title: "Cart",
			path: "/cart",
			icon: cartIcon,
		},
	];

	return (
		<div className="navbar">
			<div
				onClick={closeSidebar}
				className={`overlay ${isOpen ? "open" : ""}`}
			></div>
			<div className={`sidebar ${isOpen ? "open" : ""}`}>
				<div className="content">
					{sidebarData.map((menu, index) => (
						<Link
							className="menu"
							to={menu.path}
							key={index}
							onClick={closeSidebar}
						>
							<img src={menu.icon} alt="" />
							<p>{menu.title}</p>
						</Link>
					))}
				</div>
			</div>

			<div className="page-center">
				<div className="container">
					<div className="left">
						<button className="hamburger-menu" onClick={openSidebar}>
							<img src={hamburgerIcon} alt="" />
						</button>
						<Link className="logo" to="/home">
							TraveloHI
						</Link>
						<div>Search Component</div>
					</div>
					<div className="right">
						<NavbarMenu
							title="My Booking"
							icon={myticketIcon}
							path="/mybooking"
						/>
						<NavbarMenu
							title="My Payment Method"
							icon={paymentIcon}
							path="/profile"
						/>
						<NavbarMenu title="My Cart" icon={cartIcon} path="/cart" />
						{/* TODO VALIDASI USER UDH LOGIN ATAU BELUM */}
						{/* KALU BELUM */}
						{currUser == null ? (
							<>
								<NavbarMenu title="Login" icon={loginIcon} path="/login" />
								<div className="register-button">
									<ButtonLink title="Register" path="/register" />
								</div>
							</>
						) : (
							<>
								<Link className="profile" to={"/profile"}>
									<div className="profile-picture">
										<img
											src={
												currUser.profilePicture == null
													? anonymousProfilePicture
													: currUser.profilePicture
											}
											alt=""
										/>
									</div>
									<div className="profile-name">{currUser.userName}</div>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
