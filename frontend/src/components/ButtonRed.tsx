import PropTypes from "prop-types";
import { FC } from "react";

interface ButtonRedProps {
	label: any;
	onClick: any;
	type: any;
}

const ButtonRed: FC<ButtonRedProps> = ({ label, onClick, type }) => {
	return (
		<button onClick={onClick} type={type} className="button-red">
			{label}
		</button>
	);
};

ButtonRed.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["button", "submit", "reset"]),
};

ButtonRed.defaultProps = {
	type: "button",
};

export default ButtonRed;
