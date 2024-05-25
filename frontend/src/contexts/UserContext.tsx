import React, { createContext, useContext, useState } from "react";
import { IUser } from "../interfaces/user-interface";

interface UserContextProps {
	user: IUser | null;
	login: (userData: IUser) => void;
	logout: () => void;
}

interface UserProviderProps {
	children: JSX.Element | JSX.Element[];
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const [user, setUser] = useState<IUser | null>(null);

	const login = (userData: IUser) => {
		setUser(userData);
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): UserContextProps => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
