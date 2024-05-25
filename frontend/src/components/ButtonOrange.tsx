import PropTypes from "prop-types";
import { FC } from "react";

interface ButtonOrangeProps {
	label: any;
	onClick: any;
	type: any;
	disabled?: any;
}

const ButtonOrange: FC<ButtonOrangeProps> = ({
	label,
	onClick,
	type,
	disabled = false,
}) => {
	return (
		<button
			disabled={disabled}
			onClick={onClick}
			type={type}
			className={`button-orange ${disabled ? "disabled" : "enabled"}`}
		>
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
