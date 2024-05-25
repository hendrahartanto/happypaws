import axios from "axios";

export const postData = async (url: string, data: any, config = {}) => {
	try {
		const response = await axios.post(url, data, config);
		return response.data;
	} catch (error) {
		throw error;
	}
};
