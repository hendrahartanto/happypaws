import ButtonLink from "./ButtonLink";

const Unauthorized = () => {
	return (
		<div className="unaithorized">
			<p>UNAUTHORIZED STATUS 401</p>
			<div className="login-button">
				<ButtonLink title={"Login Here"} path={"/login"} />
			</div>
		</div>
	);
};

export default Unauthorized;
