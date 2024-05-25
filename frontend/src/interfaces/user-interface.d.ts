export interface IUser {
	ID: int;
	userName: string;
	email: string;
	password: string;
	gender: string;
	isBanned: boolean;
	isSubscribed: boolean;
	profilePicture: string | nulll;
	role: string;
	CreditCards: any;
}
