import { IUser } from "../../interfaces/user-interface";

export const validateFirstName = (firstName: string) => {
	if (firstName == "") {
		return {
			isValid: false,
			message: "First name is required",
		};
	} else if (firstName.length < 5) {
		return {
			isValid: false,
			message: "First name must be at least 5 character",
		};
	} else if (!/^[a-zA-Z]+$/.test(firstName)) {
		return {
			isValid: false,
			message: "First Name can't contain number or symbol",
		};
	} else {
		return { isValid: true };
	}
};

export const validateLastName = (lastName: string) => {
	if (lastName == "") {
		return {
			isValid: false,
			message: "Last name is required",
		};
	} else if (lastName.length < 5) {
		return {
			isValid: false,
			message: "Last name must be at least 5 character",
		};
	} else if (!/^[a-zA-Z]+$/.test(lastName)) {
		return {
			isValid: false,
			message: "Last Name can't contain number or symbol",
		};
	} else {
		return { isValid: true };
	}
};

export const validateDOB = (dob: string) => {
	if (dob === "") {
		return { isValid: false, message: "Date of birth is required" };
	}
	const today = new Date();
	const enteredDate = new Date(dob);
	let age = today.getFullYear() - enteredDate.getFullYear();

	if (
		today.getMonth() < enteredDate.getMonth() ||
		(today.getMonth() === enteredDate.getMonth() &&
			today.getDate() < enteredDate.getDate())
	) {
		age--;
	}

	return { isValid: age >= 13, message: "Must be atleast 13 years old" };
};

export const validateGender = (gender: string) => {
	return { isValid: !(gender == ""), message: "Choose the gender" };
};

export const validatePassword = (password: string) => {
	const hasValidLength = password.length >= 8 && password.length <= 30;

	return {
		isValid: hasValidLength,
		message: "Password length must be in 8 until 30 characters",
	};
};

export const validateConfirmPassword = (
	password: string,
	confirmPassword: string
) => {
	return {
		isValid: password === confirmPassword,
		message: "Confirm password is not the same as the password",
	};
};

export const validatePersonalQuestion = (personalQuestion: string) => {
	return {
		isValid: personalQuestion != "",
		message: "Choose personal question",
	};
};

export const validateAnswer = (answer: string) => {
	return {
		isValid: answer != "",
		message: "Personal question's answer is required",
	};
};

export const validateEmail = (email: string, users: IUser[]) => {
	var isUnique = true;
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
	users.forEach((user: { email: string }) => {
		if (user.email === email) {
			isUnique = false;
		}
	});

	return {
		isValid: isUnique,
		message: "Email address is already used",
	};
};
