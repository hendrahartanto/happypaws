import { useState } from "react";
import InputForm from "../../components/InputForm";
import useFetch from "../../hooks/useFetch";
import SelectForm from "../../components/SelectForm";
import ButtonOrange from "../../components/ButtonOrange";
import { postData } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const RegisterPage = () => {
	const { data, loading } = useFetch(
		"http://localhost:8080/personalquestion/getallpersonalquestion"
	);

	const { data: userData, loading: userLoading } = useFetch(
		"http://localhost:8080/user/getalluser"
	);

	const handleRecaptchaChange = (value: any) => {
		console.log("Captcha value:", value);
		setIsVerified(true);
	};

	const [isVerified, setIsVerified] = useState(false);

	const [isError, setIsError] = useState(false);
	const [erorMessage, setErrorMessage] = useState<string | undefined>("");
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		DOB: "",
		password: "",
		confirmPassword: "",
		gender: "",
		personalQuestionID: "",
		answer: "",
		isSubscribed: false,
		phoneNumber: "",
		address: "",
	});

	const genderItems = [
		{ value: "male", label: "Male" },
		{ value: "female", label: "Female" },
	];

	const handleInputChange = (e: any) => {
		const { name, value, type, checked } = e.target;

		const inputValue = type === "checkbox" ? checked : value;

		setFormData({
			...formData,
			[name]: inputValue,
		});
	};

	if (formData.personalQuestionID != "") {
		var selectedQuestion = data.find(
			(item: { ID: any }) => item.ID == formData.personalQuestionID
		);
	}

	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const {
			firstName,
			lastName,
			email,
			DOB,
			password,
			confirmPassword,
			gender,
			personalQuestionID,
			answer,
			isSubscribed,
			address,
			phoneNumber,
		} = formData;

		const userName = `${capitalize(firstName)} ${capitalize(lastName)}`;

		try {
			await postData("http://localhost:8080/user/signup", {
				userName,
				email,
				DOB,
				password,
				confirmPassword,
				gender,
				answer,
				isSubscribed,
				isBanned: false,
				profilePicture: null,
				role: "user",
				address,
				phoneNumber,
				personalQuestionID:
					personalQuestionID == "" ? 0 : parseInt(personalQuestionID),
			});
		} catch (error: any) {
			setIsError(true);
			setErrorMessage(error.message);
			return;
		}

		setIsError(false);

		await postData("http://localhost:8080/answer/postanswer", {
			userID: currUserID,
			answer: "tes",
			personalQuestionID: parseInt(personalQuestionID),
		});

		alert("Successfully created an account");
		navigate("/login");
	};

	if (loading || userLoading) {
		return <div>Tes</div>;
	}

	const currUserID = userData.length + 1;

	return (
		<div className="register-page">
			<form action="">
				<div className="header">Register</div>
				<div className="form-container">
					<div className="left">
						<InputForm
							label="First Name"
							placeHolder="Insert first name"
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleInputChange}
						/>
						<InputForm
							label="Email Address"
							placeHolder="Insert email address"
							type="text"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
						/>
						<InputForm
							label="Password"
							placeHolder="Insert password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
						/>
						<InputForm
							label="Phone Number"
							placeHolder="Insert phone number"
							type="text"
							name="phoneNumber"
							value={formData.phoneNumber}
							onChange={handleInputChange}
						/>
						<div className="gender-input">
							<div className="label">Gender</div>
							<div className="container">
								{genderItems.map((item) => (
									<div key={item.value}>
										<input
											type="radio"
											name="gender"
											value={item.value}
											checked={formData.gender === item.value}
											onChange={handleInputChange}
										/>
										<label htmlFor={item.value}>{item.label}</label>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="right">
						<InputForm
							label="Last Name"
							placeHolder="Insert last name"
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleInputChange}
						/>
						<InputForm
							label="Date of Birth"
							placeHolder=""
							type="date"
							name="DOB"
							value={formData.DOB}
							onChange={handleInputChange}
						/>
						<InputForm
							label="Confirm Password"
							placeHolder="Insert confirm password"
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleInputChange}
						/>
						<InputForm
							label="Address"
							placeHolder="Insert address"
							type="text"
							name="address"
							value={formData.address}
							onChange={handleInputChange}
						/>
						<SelectForm
							label="Select Personal Question"
							name="personalQuestionID"
							value={formData.personalQuestionID}
							options={data.map((item: { ID: string; Question: string }) => ({
								id: item.ID,
								name: item.Question,
							}))}
							onChange={handleInputChange}
						/>
					</div>
				</div>
				<div className="bottom">
					<InputForm
						label={
							formData.personalQuestionID == ""
								? "Select Personal Question First"
								: selectedQuestion.Question
						}
						placeHolder="Insert answer"
						type="text"
						name="answer"
						value={formData.answer}
						onChange={handleInputChange}
					/>
					<div className="flex-container">
						<InputForm
							type="checkbox"
							value={formData.isSubscribed}
							name="isSubscribed"
							placeHolder="tes"
							label={"Subsribe to Newsletter"}
							onChange={handleInputChange}
						/>
						<ReCAPTCHA
							sitekey="6LckjG8pAAAAAPXh0vtHToHxry65O-YG9IeWZ4Uz"
							onChange={handleRecaptchaChange}
						/>
					</div>
					{isError && <div className="error">{erorMessage}</div>}
					<div className="submit-button">
						<ButtonOrange
							disabled={!isVerified}
							label={"Create an Account"}
							type={"submit"}
							onClick={handleSubmit}
						/>
					</div>
					<Link to="/login">Already have an account?</Link>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
