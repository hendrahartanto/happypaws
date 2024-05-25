import React from "react";
import { Link } from "react-router-dom";

interface NavbarMenuProps {
	title: string;
	path: string;
	icon: string;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({ title, path, icon }) => {
	return (
		<Link className="navbar-menu" to={path}>
			<img src={icon} alt="" />
			<p>{title}</p>
		</Link>
	);
};

export default NavbarMenu;
