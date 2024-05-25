import { IUser } from "../../interfaces/user-interface";

export const validateEmail = (email: string, users: IUser[]) => {
	if (email === "") {
		return {
			isValid: false,
			message: "Email address can't be empty",
		};
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return {
			isValid: false,
			message: "Email address is not valid",
		};
	}

	const found = users.some((user) => {
		return user.email === email;
	});

	return {
		isValid: found,
		message: "Email address not found",
	};
};

export const validatePassword = (
	email: string,
	password: string,
	users: IUser[]
) => {
	for (let i = 0; i < users.length; i++) {
		if (users[i].email == email && users[i].password == password) {
			return {
				isValid: true,
				message: "",
				index: i,
			};
		}
	}

	return {
		isValid: false,
		message: "Password is incorrect",
		index: -1,
	};
};
