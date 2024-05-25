import PropTypes from "prop-types";
import { FC } from "react";

interface ButtonBlueProps {
	label: any;
	onClick: any;
	type: any;
}

const ButtonBlue: FC<ButtonBlueProps> = ({ label, onClick, type }) => {
	return (
		<button onClick={onClick} type={type} className="button-blue">
			{label}
		</button>
	);
};

ButtonBlue.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["button", "submit", "reset"]),
};

ButtonBlue.defaultProps = {
	type: "button",
};

export default ButtonBlue;
