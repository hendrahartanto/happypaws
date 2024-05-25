import Navbar from "../layouts/Navbar";
import { IChildren } from "../interfaces/children-interface";

const MainTempelate = ({ children }: IChildren) => {
	return (
		<>
			<Navbar />
			<div className="content">{children}</div>
		</>
	);
};

export default MainTempelate;
