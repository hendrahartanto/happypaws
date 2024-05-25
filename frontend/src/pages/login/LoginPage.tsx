import { useState } from "react";
import ButtonLink from "../../components/ButtonLink";
import InputForm from "../../components/InputForm";
import useFetch from "../../hooks/useFetch";
import ButtonOrange from "../../components/ButtonOrange";
import { validateEmail, validatePassword } from "./loginValidation";
import { postData } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const LoginPage = () => {
  const { data: userData, loading: userLoading } = useFetch(
    "http://localhost:8080/user/getalluser"
  );

  const { login } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    isError: false,
    erroeMessage: "",
  });

  const [emailIsValid, setEmailIsValid] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContinue = (e: any) => {
    e.preventDefault();
    var result;
    if (!(result = validateEmail(formData.email.trim(), userData)).isValid) {
      setError({
        isError: true,
        erroeMessage: result.message,
      });
      return;
    } else {
      setError({
        isError: false,
        erroeMessage: "",
      });
    }
    setEmailIsValid(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    var result;
    let index;
    if (
      !(result = validatePassword(
        formData.email.trim(),
        formData.password.trim(),
        userData
      )).isValid
    ) {
      setError({
        isError: true,
        erroeMessage: result.message,
      });
      return;
    } else {
      setError({
        isError: false,
        erroeMessage: "",
      });
      index = result.index;
    }

    const currUser = userData[index];

    login(currUser);

    await postData("http://localhost:8080/user/login", formData, {
      withCredentials: true,
    });

    navigate("/home");
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-page">
      <form action="">
        <div className="header">Login</div>
        {!emailIsValid ? (
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
        ) : (
          <div className="top">
            <InputForm
              label="Password"
              placeHolder="Insert password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {error.isError && <div className="error">{error.erroeMessage}</div>}
            <div className="button">
              <ButtonOrange
                type={"submit"}
                label={"Login"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}
        <div className="separator">or login with</div>
        <div className="button">
          <ButtonLink title="Register Account" path="/register"></ButtonLink>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
