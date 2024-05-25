import PropTypes from "prop-types";
import { FC } from "react";

interface ButtonOrangeProps {
	label: any;
	onClick: any;
	type: any;
}

const ButtonOrange: FC<ButtonOrangeProps> = ({ label, onClick, type }) => {
	return (
		<button onClick={onClick} type={type} className="button-orange">
			{label}
		</button>
	);
};

ButtonOrange.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["button", "submit", "reset"]),
};

ButtonOrange.defaultProps = {
	type: "button",
};

export default ButtonOrange;
