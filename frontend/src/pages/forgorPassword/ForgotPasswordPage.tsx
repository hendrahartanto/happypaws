import { useState } from "react";
import InputForm from "../../components/InputForm";
import ButtonOrange from "../../components/ButtonOrange";
import { fetchData, postData, updateData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import ButtonBlue from "../../components/ButtonBlue";
import ButtonLink from "../../components/ButtonLink";

const ForgotPassword = () => {
	const [user, setUser] = useState<any>(null);
	const navigate = useNavigate();

	let userData: {
		Answers: {
			PersonalQuestion: any;
			ID: any;
		}[];
	} | null = null;
	const [question, setQuestion] = useState("");
	const [currSlide, setCurrSlide] = useState(0);

	const [formData, setFormData] = useState({
		email: "",
		answer: "",
		password: "",
	});

	const [error, setError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const handleEmailSubmit = async (e: any) => {
		e.preventDefault();
		if (formData.email == "") {
			setError({
				isError: true,
				erroeMessage: "Email is required",
			});
			return;
		}
		try {
			userData = await fetchData(
				`http://localhost:8080/user/getuserbyemail/${formData.email}`
			);
		} catch (error: any) {
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
		if (userData != null) {
			setQuestion(userData.Answers[0].PersonalQuestion.Question);
		}
		setCurrSlide(1);
		setUser(userData);
	};

	const handleAnswerSubmit = async (e: any) => {
		e.preventDefault();
		if (formData.answer == "") {
			setError({
				isError: true,
				erroeMessage: "Answer is required",
			});
			return;
		}
		try {
			userData = await postData("http://localhost:8080/answer/validateanswer", {
				answerID: user.Answers[0].ID,
				answer: formData.answer,
			});
		} catch (error: any) {
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
		setCurrSlide(2);
	};

	const handleNewPasswordSubmit = async (e: any) => {
		e.preventDefault();
		try {
			userData = await updateData("http://localhost:8080/user/updatepassword", {
				userID: user.ID,
				newPassword: formData.password,
			});
		} catch (error: any) {
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

		alert("Password successfully updated!");
		navigate("/login");
	};

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<div className="forgot-password-page">
			{currSlide == 0 && (
				<form action="" className="form">
					<div className="header">Change Password</div>
					<InputForm
						label="Email Address"
						placeHolder="Insert email address"
						type="text"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
					/>
					{error.isError && <div className="error">{error.erroeMessage}</div>}
					<div className="button">
						<ButtonOrange
							type={"submit"}
							label={"Continue"}
							onClick={handleEmailSubmit}
						/>
					</div>
					<div className="button">
						<ButtonLink title={"Login Page"} path={"/login"} />
					</div>
				</form>
			)}
			{currSlide == 1 && (
				<form action="" className="form">
					<div className="header">Change Password</div>
					<InputForm
						label={question}
						placeHolder="Insert answer"
						type="text"
						name="answer"
						value={formData.answer}
						onChange={handleInputChange}
					/>
					{error.isError && <div className="error">{error.erroeMessage}</div>}
					<div className="button">
						<ButtonOrange
							type={"submit"}
							label={"Continue"}
							onClick={handleAnswerSubmit}
						/>
					</div>
					<div className="button">
						<ButtonLink title={"Login Page"} path={"/login"} />
					</div>
				</form>
			)}
			{currSlide == 2 && (
				<form action="" className="form">
					<div className="header">Change Password</div>
					<InputForm
						label={"New Password"}
						placeHolder="Insert new password"
						type="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
					/>
					{error.isError && <div className="error">{error.erroeMessage}</div>}
					<div className="button">
						<ButtonOrange
							type={"submit"}
							label={"Change Password"}
							onClick={handleNewPasswordSubmit}
						/>
					</div>
					<div className="button">
						<ButtonLink title={"Login Page"} path={"/login"} />
					</div>
				</form>
			)}
		</div>
	);
};

export default ForgotPassword;
