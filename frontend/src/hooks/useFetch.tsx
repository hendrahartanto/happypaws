import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useFetch = (url: string) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await axios.get(url, {
				withCredentials: true,
			});

			const result = response.data;
			setData(result);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError;
				if (axiosError.response && axiosError.response.status === 401) {
					setError("Unauthorized access. Please log in.");
				} else {
					setError("Error fetching data.");
				}
			} else {
				setError("Non-Axios error.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [url]);

	const refetch = () => {
		setLoading(true);
		fetchData();
	};

	if (error && error.includes("Unauthorized")) {
		return { unauthorized: true, refetch };
	}

	return { data, loading, error, refetch };
};

export default useFetch;
