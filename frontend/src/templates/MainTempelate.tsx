import Navbar from "../layouts/Navbar";
import { IChildren } from "../interfaces/children-interface";
import Footer from "../layouts/Footer";
import { useState } from "react";

const MainTempelate = ({ children }: IChildren) => {
	const [isDark, setIsDark] = useState(false);

	return (
		<div data-theme={isDark ? "dark" : "light"}>
			<Navbar isDark={isDark} setIsDark={setIsDark} />
			<div className="content">{children}</div>
			<Footer />
		</div>
	);
};

export default MainTempelate;
