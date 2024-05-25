import { useState } from "react";
import ButtonLink from "../../components/ButtonLink";
import InputForm from "../../components/InputForm";
import ButtonOrange from "../../components/ButtonOrange";
import { postData } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import ButtonPlain from "../../components/ButtonPlain";

const LoginPage = () => {
	const navigate = useNavigate();

	const [isVerified, setIsVerified] = useState(false);

	const [currSlide, setCurrSlide] = useState(0);

	const handleRecaptchaChange = (value: any) => {
		console.log("Captcha value:", value);
		setIsVerified(true);
	};

	const [formData, setFormData] = useState({
		email: "",
		password: "",
		OTP: "",
	});

	const [error, setError] = useState({
		isError: false,
		erroeMessage: "",
	});

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleContinue = async (e: any) => {
		e.preventDefault();
		try {
			await postData("http://localhost:8080/user/loginemail", formData, {
				withCredentials: true,
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
		setCurrSlide(1);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await postData(
				"http://localhost:8080/user/login",
				{
					email: formData.email,
					password: formData.password,
				},
				{
					withCredentials: true,
				}
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

		navigate("/home");
	};

	const handleOTPContinue = async (e: any) => {
		e.preventDefault();
		try {
			await postData("http://localhost:8080/user/loginemailwithotp", formData, {
				withCredentials: true,
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

	const hanldeOTPSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await postData(
				"http://localhost:8080/user/validateotp",
				{
					email: formData.email,
					OTP: formData.OTP,
				},
				{
					withCredentials: true,
				}
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

		navigate("/home");
	};

	return (
		<div className="login-page">
			<form action="">
				<div className="header">Login</div>
				{currSlide == 0 && (
					<div className="top">
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
								onClick={handleContinue}
							/>
						</div>
					</div>
				)}
				{currSlide == 1 && (
					<div className="top">
						<InputForm
							label="Password"
							placeHolder="Insert password"
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
						/>
						<ReCAPTCHA
							sitekey="6LckjG8pAAAAAPXh0vtHToHxry65O-YG9IeWZ4Uz"
							onChange={handleRecaptchaChange}
						/>
						{error.isError && <div className="error">{error.erroeMessage}</div>}
						<div className="button">
							<ButtonOrange
								disabled={!isVerified}
								type={"submit"}
								label={"Login"}
								onClick={handleSubmit}
							/>
						</div>
					</div>
				)}
				{currSlide == 2 && (
					<div className="top">
						<InputForm
							label="OTP Code"
							placeHolder="Insert OTP Code"
							type="text"
							name="OTP"
							value={formData.OTP}
							onChange={handleInputChange}
						/>
						<ReCAPTCHA
							sitekey="6LckjG8pAAAAAPXh0vtHToHxry65O-YG9IeWZ4Uz"
							onChange={handleRecaptchaChange}
						/>
						{error.isError && <div className="error">{error.erroeMessage}</div>}
						<div className="button">
							<ButtonOrange
								disabled={!isVerified}
								type={"submit"}
								label={"Login"}
								onClick={hanldeOTPSubmit}
							/>
						</div>
					</div>
				)}
				<div className="separator">or login with</div>
				<div className="bottom">
					{currSlide != 2 && (
						<div className="button">
							<ButtonPlain
								label={"Login With OTP"}
								onClick={handleOTPContinue}
								type={"button"}
							/>
						</div>
					)}
					<div className="button">
						<ButtonLink title="Register Account" path="/register"></ButtonLink>
					</div>
					<Link className="forgot-password" to="/forgotpassword">
						Forgot your password?
					</Link>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
