import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainTempelate from "./templates/MainTempelate";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import SignTempelate from "./templates/SignTempelate";
import "./styles";
import RegisterPage from "./pages/register/RegisterPage";
import { UserProvider } from "./contexts/UserContext";
import HotelsPage from "./pages/hotels/HotelsPage";
import FlightsPage from "./pages/flights/FlightsPage";
import HotelsPageDetail from "./pages/hotels/HotelsPageDetail";
import ProfilePage from "./pages/profile/ProfilePage";
import CartPage from "./pages/cart/CartPage";
import ForgotPassword from "./pages/forgorPassword/ForgotPasswordPage";
import FlightDetailPage from "./pages/flights/FlightDetailPage";
import MyBookingPage from "./pages/myBooking/MyBookingPage";
import HistoryPage from "./pages/history/HistoryPage";
import UserListPage from "./pages/userList/UserListPage";
import AdminPage from "./pages/admin/AdminPage";
import GamePage from "./pages/game/GamePage";
import PromoPage from "./pages/promo/PromoPage";
import CheckLocationPage from "./pages/checkLocation/CheckLocationPage";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<UserProvider>
					<Routes>
						<Route path="/" element={<Navigate to="/home" />} />
						<Route
							path="/forgotpassword"
							element={
								<SignTempelate>
									<ForgotPassword />
								</SignTempelate>
							}
						/>
						<Route
							path="/userlist"
							element={
								<MainTempelate>
									<UserListPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/home"
							element={
								<MainTempelate>
									<HomePage />
								</MainTempelate>
							}
						/>
						<Route
							path="/admin"
							element={
								<MainTempelate>
									<AdminPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/profile"
							element={
								<MainTempelate>
									<ProfilePage />
								</MainTempelate>
							}
						/>
						<Route
							path="/cart"
							element={
								<MainTempelate>
									<CartPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/hotels/"
							element={
								<MainTempelate>
									<HotelsPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/hotels/:id"
							element={
								<MainTempelate>
									<HotelsPageDetail />
								</MainTempelate>
							}
						/>
						<Route
							path="/flights"
							element={
								<MainTempelate>
									<FlightsPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/flight/:id"
							element={
								<MainTempelate>
									<FlightDetailPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/mybooking"
							element={
								<MainTempelate>
									<MyBookingPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/history"
							element={
								<MainTempelate>
									<HistoryPage />
								</MainTempelate>
							}
						/>
						<Route
							path="/login"
							element={
								<SignTempelate>
									<LoginPage />
								</SignTempelate>
							}
						/>
						<Route
							path="/register"
							element={
								<SignTempelate>
									<RegisterPage></RegisterPage>
								</SignTempelate>
							}
						/>
						<Route
							path="/promo"
							element={
								<MainTempelate>
									<PromoPage></PromoPage>
								</MainTempelate>
							}
						/>
						<Route
							path="/checklocation"
							element={
								<MainTempelate>
									<CheckLocationPage></CheckLocationPage>
								</MainTempelate>
							}
						/>
						<Route path="/game" element={<GamePage />} />
					</Routes>
				</UserProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
