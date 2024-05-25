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

function App() {
	const [isDark, setIsDark] = useState(false);

	return (
		<div className="App" data-theme={isDark ? "dark" : "light"}>
			<BrowserRouter>
				<UserProvider>
					<Routes>
						<Route path="/" element={<Navigate to="/home" />} />
						<Route
							path="/home"
							element={
								<MainTempelate>
									<HomePage />
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
					</Routes>
				</UserProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
