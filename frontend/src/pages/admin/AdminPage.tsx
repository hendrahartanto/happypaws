import { ChangeEvent, useState } from "react";
import Unauthorized from "../../components/Unauthorized";
import useFetch from "../../hooks/useFetch";
import InputForm from "../../components/InputForm";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../services/firebase";
import SelectForm from "../../components/SelectForm";
import ButtonOrange from "../../components/ButtonOrange";
import { postData } from "../../services/api";

const AdminPage = () => {
	const { unauthorized } = useFetch("http://localhost:8080/admin/validate");
	const { data: cities, loading: citiesLoading } = useFetch(
		"http://localhost:8080/city/getallcity"
	);

	let photoURL = "";

	const [isUnauthorized, setIsUnauthorized] = useState(false);

	const [hotelError, setHotelError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const [promoError, setPromoError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const [hotelFormData, setHotelFormData] = useState({
		hotelName: "",
		description: "",
		address: "",
		cityID: "",
		picture: "",
	});

	const [promoFormData, setPromoFormData] = useState({
		promoName: "",
		promoPicture: "",
		promoCode: "",
	});

	const [filterFacilities, setFilterFacilities] = useState({
		AC: false,
		"Swimming Pool": false,
		Parking: false,
		Elevator: false,
		WiFi: false,
		"24-Hour Front Desk": false,
		Restaurant: false,
	});

	const handleFilterFacilitiesChange = (e: any) => {
		const { name, checked } = e.target;
		setFilterFacilities({ ...filterFacilities, [name]: checked });
	};

	const resetHotelFormData = () => {
		setHotelFormData({
			hotelName: "",
			description: "",
			address: "",
			cityID: "",
			picture: "",
		});
		setFilterFacilities({
			AC: false,
			"Swimming Pool": false,
			Parking: false,
			Elevator: false,
			WiFi: false,
			"24-Hour Front Desk": false,
			Restaurant: false,
		});
		photoURL = "";
		setPhoto(null);
	};

	const resetPromoFormData = () => {
		setPromoFormData({
			promoName: "",
			promoPicture: "",
			promoCode: "",
		});
		setPhoto(null);
	};

	const [photo, setPhoto] = useState(null);

	const handleFileChange = (e: any) => {
		if (e.target.files[0]) {
			setPhoto(e.target.files[0]);
		}
	};

	const handleInputChange = (e: any) => {
		const { name, value, type, checked } = e.target;

		const inputValue = type === "checkbox" ? checked : value;

		setHotelFormData({
			...hotelFormData,
			[name]: inputValue,
		});

		setPromoFormData({
			...promoFormData,
			[name]: inputValue,
		});
	};

	const handleFileUpload = async () => {
		if (photo) {
			const storageRef = ref(storage, `photos/${(photo as File).name}`);
			try {
				await uploadBytes(storageRef, photo);
				photoURL = await getDownloadURL(storageRef);
			} catch (error: any) {
				console.error("Error uploading photo:", error.message);
			}
		}
	};

	const handleCreateHotel = async (e: any) => {
		e.preventDefault();
		const facilities = Object.entries(filterFacilities)
			.filter(([_, isChecked]) => isChecked)
			.map(([option]) => option);
		await handleFileUpload();
		try {
			await postData(
				"http://localhost:8080/hotel/createhotel",
				{
					hotelName: hotelFormData.hotelName,
					description: hotelFormData.description,
					address: hotelFormData.address,
					cityID: parseInt(hotelFormData.cityID.toString()),
					picture: photoURL,
					facilities: facilities,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
			setHotelError({
				isError: true,
				erroeMessage: error.message,
			});
			return;
		}
		setHotelError({
			isError: false,
			erroeMessage: "",
		});
		resetHotelFormData();
	};

	const handleCreatePromoCode = async (e: any) => {
		e.preventDefault();
		await handleFileUpload();
		console.log(photoURL);
		try {
			await postData(
				"http://localhost:8080/promo/addpromo",
				{
					promoName: promoFormData.promoName,
					promoCode: promoFormData.promoCode,
					promoPicture: photoURL,
				},
				{ withCredentials: true }
			);
		} catch (error: any) {
			if (error.message.includes("Unauthorized")) {
				setIsUnauthorized(true);
				return;
			}
			setPromoError({
				isError: true,
				erroeMessage: error.message,
			});
			return;
		}
		setPromoError({
			isError: false,
			erroeMessage: "",
		});
		resetPromoFormData();
		alert("Successfully created promo!");
	};

	if (citiesLoading) {
		return <div>Loading...</div>;
	}

	if (unauthorized || isUnauthorized) {
		return <Unauthorized />;
	}

	console.log(cities);

	return (
		<div className="admin-page">
			<div className="page-center">
				<div className="admin-page-container">
					<div className="add-hotel-section">
						<div className="header">Add Hotel</div>
						<form action="" className="section-container">
							<InputForm
								label={"Hotel Picture"}
								placeHolder={"Insert hotel picture"}
								type={"file"}
								name={"picture"}
								value={undefined}
								onChange={handleFileChange}
							/>
							<InputForm
								label={"Hotel Name"}
								placeHolder={"Insert hotel name"}
								type={"text"}
								name={"hotelName"}
								value={hotelFormData.hotelName}
								onChange={handleInputChange}
							/>
							<InputForm
								label={"Hotel Description"}
								placeHolder={"Insert hotel description"}
								type={"text"}
								name={"description"}
								value={hotelFormData.description}
								onChange={handleInputChange}
							/>
							<InputForm
								label={"Hotel Address"}
								placeHolder={"Insert hotel address"}
								type={"text"}
								name={"address"}
								value={hotelFormData.address}
								onChange={handleInputChange}
							/>
							<SelectForm
								label="Select City"
								name="cityID"
								value={hotelFormData.cityID}
								options={cities.map(
									(item: { ID: string; CityName: string }) => ({
										id: item.ID,
										name: item.CityName,
									})
								)}
								onChange={handleInputChange}
							/>
							<div className="filter-checkbox">
								<div className="header">Facilities</div>
								<div className="checkbox-container">
									{Object.entries(filterFacilities).map(
										([name, value]: any) => (
											<label key={name}>
												<input
													type="checkbox"
													name={name}
													checked={value}
													onChange={handleFilterFacilitiesChange}
												/>
												{name}
											</label>
										)
									)}
								</div>
							</div>
							{hotelError.isError && (
								<div className="error">{hotelError.erroeMessage}</div>
							)}
							<div className="button">
								<ButtonOrange
									label={"Create"}
									onClick={handleCreateHotel}
									type={"button"}
								/>
							</div>
						</form>
					</div>
					<div className="add-promo-code-section">
						<div className="header">Add Promo</div>
						<div className="section-container">
							<InputForm
								label={"Promo Name"}
								placeHolder={"Insert promo name"}
								type={"text"}
								name={"promoName"}
								value={promoFormData.promoName}
								onChange={handleInputChange}
							/>
							<InputForm
								label={"Promo Code"}
								placeHolder={"Insert promo code"}
								type={"text"}
								name={"promoCode"}
								value={promoFormData.promoCode}
								onChange={handleInputChange}
							/>
							<InputForm
								label={"Promo Picture"}
								placeHolder={"Insert promo picture"}
								type={"file"}
								name={"promoPicture"}
								value={undefined}
								onChange={handleFileChange}
							/>
							{promoError.isError && (
								<div className="error">{promoError.erroeMessage}</div>
							)}
							<div className="button">
								<ButtonOrange
									label={"Create"}
									onClick={handleCreatePromoCode}
									type={"button"}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
