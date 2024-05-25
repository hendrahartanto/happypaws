import axios from "axios";

export const postData = async (url: string, data: any, config = {}) => {
	try {
		const response = await axios.post(url, data, config);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.error || "Unauthorized");
		} else if (error.request) {
			throw new Error("No response received");
		} else {
			throw new Error("Error setting up the request");
		}
	}
};

export const fetchData = async (url: string, config = {}) => {
	try {
		const response = await axios.get(url, config);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.error || "Registration failed");
		} else if (error.request) {
			throw new Error("No response received");
		} else {
			throw new Error("Error setting up the request");
		}
	}
};

export const updateData = async (url: string, data: any, config = {}) => {
	try {
		const response = await axios.put(url, data, config);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data.error || "Unauthorized");
		} else if (error.request) {
			throw new Error("No response received");
		} else {
			throw new Error("Error setting up the request");
		}
	}
};
