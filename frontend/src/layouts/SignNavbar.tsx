import { Link } from "react-router-dom";

const SignNavbar = () => {
	return (
		<div className="sign-navbar">
			<div className="page-center">
				<div className="container">
					<Link className="logo" to="/home">
						Happy Paws
					</Link>
					<p>{location.pathname.includes("login") ? "Login" : "Register"}</p>
				</div>
			</div>
		</div>
	);
};

export default SignNavbar;
