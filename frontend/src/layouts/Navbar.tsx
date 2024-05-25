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
import historyIcon from "../assets/UI/history.svg";
import { useUser } from "../contexts/UserContext";
import useFetch from "../hooks/useFetch";
import ButtonBlue from "../components/ButtonBlue";
import NavbarDropdown from "./components/NavbarDropdown";
import adminIcon from "../assets/UI/settings.svg";
import gameIcon from "../assets/UI/game.svg";

interface NavbarProps {
	isDark: any;
	setIsDark: any;
}

const Navbar: React.FC<NavbarProps> = ({ setIsDark, isDark }) => {
	const { login, logout } = useUser();
	const {
		data: currUser,
		loading: currUserloading,
		refetch: currUserRefetch,
	} = useFetch(`http://localhost:8080/user/validate?${location.pathname}`);

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
	}, [currUser]);

	if (currUserloading) {
		return <div>Loading</div>;
	}

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
		{
			title: "History",
			path: "/history",
			icon: historyIcon,
		},
		{
			title: "Game",
			path: "/game",
			icon: gameIcon,
		},
		{
			title: "Check Location",
			path: "/checklocation",
			icon: hotelIcon,
		},
	];

	if (currUser?.role == "admin") {
		sidebarData.push(
			{
				title: "User List",
				path: "/userlist",
				icon: loginIcon,
			},
			{
				title: "Admin",
				path: "/admin",
				icon: adminIcon,
			},
			{
				title: "Promo",
				path: "/promo",
				icon: myticketIcon,
			}
		);
	}

	const loggingOut = async () => {
		try {
			const response = await fetch("http://localhost:8080/user/removecookie", {
				method: "GET",
				credentials: "include",
			});
			if (response.ok) {
				console.log("Logout successful");
			} else {
				console.error("Logout failed:", response.statusText);
			}
		} catch (error) {
			console.error("Error during logout:");
		}
		logout();
		currUserRefetch();
	};

	const creditCardIsAvailable = {
		label: "Credit Card",
		onClick: undefined,
		icon: undefined,
		description: currUser?.CreditCards[0]?.amount.toLocaleString("id-ID", {
			style: "currency",
			currency: "iDR",
		}),
	};

	const paymentMethodContents = [
		{
			label: "HI Wallet",
			onClick: undefined,
			icon: undefined,
			description: currUser?.money.toLocaleString("id-ID", {
				style: "currency",
				currency: "iDR",
			}),
		},
	];

	if (currUser?.CreditCards.length > 0) {
		paymentMethodContents.push(creditCardIsAvailable);
	} else {
		paymentMethodContents.push({
			label: "Credit Card",
			onClick: undefined,
			description: "Credit card is not registered",
			icon: undefined,
		});
	}

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
							Happy Paws
						</Link>
						<div>Search Component</div>
					</div>
					<div className="right">
						<NavbarMenu
							title="My Booking"
							icon={myticketIcon}
							path="/mybooking"
						/>
						<NavbarMenu title="My Cart" icon={cartIcon} path="/cart" />
						{currUser == null ? (
							<>
								<NavbarMenu title="Login" icon={loginIcon} path="/login" />
							</>
						) : (
							<>
								<NavbarDropdown
									title="My Payment Method"
									icon={paymentIcon}
									contents={paymentMethodContents}
								/>
								<Link className="profile" to={"/profile"}>
									<div className="profile-picture">
										<img src={currUser.profilePicture} alt="" />
									</div>
									<div className="profile-name">{currUser.userName}</div>
								</Link>
								<div className="button">
									<ButtonBlue
										label={"Logout"}
										onClick={loggingOut}
										type={"button"}
									/>
								</div>
							</>
						)}
						<div className="button">
							<ButtonBlue
								label={`${isDark ? "Dark Theme" : "Light Theme"}`}
								onClick={() => setIsDark(!isDark)}
								type={"button"}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
