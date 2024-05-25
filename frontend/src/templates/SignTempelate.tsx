import SignNavbar from "../layouts/SignNavbar";
import { IChildren } from "../interfaces/children-interface";

const SignTempelate = ({ children }: IChildren) => {
  return (
    <>
      <SignNavbar />
      <div className="content">{children}</div>
    </>
  );
};

export default SignTempelate;
