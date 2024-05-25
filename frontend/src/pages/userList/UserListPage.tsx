import { ChangeEvent, useEffect, useState } from "react";
import Unauthorized from "../../components/Unauthorized";
import useFetch from "../../hooks/useFetch";
import { useUser } from "../../contexts/UserContext";
import ButtonBlue from "../../components/ButtonBlue";
import { postData, updateData } from "../../services/api";
import InputForm from "../../components/InputForm";
import ButtonOrange from "../../components/ButtonOrange";

const UserListPage = () => {
	const [error, setError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const { user: currUser } = useUser();

	const [unaithorized, setIsUnauthorized] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		broadcastMessage: "",
	});

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const {
		data: userData,
		loading: userLoading,
		unauthorized,
		refetch: userRefetch,
	} = useFetch("http://localhost:8080/admin/getuserlist");

	useEffect(() => {
		userRefetch();
	}, [currUser]);

	const toggleBanUser = async (userID: any) => {
		try {
			await updateData(
				"http://localhost:8080/admin/togglebanuser",
				{
					userID: userID,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
		}
		userRefetch();
	};

	const handleBroadcast = async (e: any) => {
		e.preventDefault();
		setError({
			isError: false,
			erroeMessage: "",
		});
		setIsLoading(true);
		try {
			await postData(
				"http://localhost:8080/admin/sendbroadcast",
				{
					broadcastMessage: formData.broadcastMessage,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			setIsLoading(false);
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
		setIsLoading(false);
		setFormData({
			broadcastMessage: "",
		});
		alert("Broadcast Message Sent!");
	};

	if (userLoading) {
		return <div>Loading...</div>;
	}

	if (unauthorized) {
		return <Unauthorized />;
	}

	console.log(userData);

	return (
		<div className="user-list-page">
			<div className="page-center">
				<div className="user-list-page-container">
					<div className="broadcast-section">
						<div className="header">Broadcast</div>
						<form action="" className="broadcast-container">
							<InputForm
								label={"Broadcast Message"}
								placeHolder={"Insert broadcast message"}
								type={"text"}
								name={"broadcastMessage"}
								value={formData.broadcastMessage}
								onChange={handleInputChange}
							/>
							{isLoading && <div className="loading">Loading...</div>}
							{error.isError && (
								<div className="error">{error.erroeMessage}</div>
							)}
							<div className="button">
								<ButtonOrange
									label={"Send"}
									onClick={handleBroadcast}
									type={"button"}
								/>
							</div>
						</form>
					</div>
					<div className="user-list-section">
						<div className="user-list-header">User List</div>
						{userData.map((user: any) => (
							<>
								{user.ID != currUser?.ID && (
									<div key={user.ID} className="user-card">
										<div className="card-left">
											<img src={user.profilePicture} alt="" />
										</div>
										<div className="card-right">
											<div className="header">
												<div className="left">
													<p className="username">{user.userName}</p>
													<div
														className={`user-status ${
															user.isBanned ? "banned" : ""
														}`}
													>
														{user.isBanned ? "Banned" : "Active"}
													</div>
												</div>
												{user.isBanned ? (
													<div className="button">
														<ButtonBlue
															label={"Unban"}
															onClick={() => toggleBanUser(user.ID)}
															type={"button"}
														/>
													</div>
												) : (
													<div className="button">
														<ButtonBlue
															label={"Ban"}
															onClick={() => toggleBanUser(user.ID)}
															type={"button"}
														/>
													</div>
												)}
											</div>
											<div className="user-information">
												<p>Role: {user.role}</p>
												<p>Gender: {user.gender}</p>
												<p>Address: {user.address}</p>
												<p>Phone Number: {user.phoneNumber}</p>
												<p>Email: {user.email}</p>
											</div>
										</div>
									</div>
								)}
							</>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserListPage;
