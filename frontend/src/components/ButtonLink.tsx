import React from "react";
import { Link } from "react-router-dom";

interface ButtonLinkProps {
	title: string;
	path: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ title, path }) => {
	return (
		<Link className="button-link" to={path}>
			{title}
		</Link>
	);
};

export default ButtonLink;
