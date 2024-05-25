import React from "react";

interface NavbarDropdownProps {
	title: string;
	icon: string;
	contents: any;
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({
	title,
	icon,
	contents,
}) => {
	return (
		<div className="navbar-dropdown">
			<img src={icon} alt="" />
			<p>{title}</p>
			<div className="dropdown-content">
				{contents.map((content: any, index: number) => (
					<div
						className={`content ${index === 0 ? "first-item" : "else"}`}
						key={index}
						onClick={content.onClick}
					>
						<div className="top">
							<img src={content.icon} alt="" />
							<p>{content.label}</p>
						</div>
						<p className="description">{content.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default NavbarDropdown;
