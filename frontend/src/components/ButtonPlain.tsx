import PropTypes from "prop-types";
import { FC } from "react";

interface ButtonPlainProps {
	label: any;
	onClick: any;
	type: any;
}

const ButtonPlain: FC<ButtonPlainProps> = ({ label, onClick, type }) => {
	return (
		<button onClick={onClick} type={type} className="button-plain">
			{label}
		</button>
	);
};

ButtonPlain.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["button", "submit", "reset"]),
};

ButtonPlain.defaultProps = {
	type: "button",
};

export default ButtonPlain;
