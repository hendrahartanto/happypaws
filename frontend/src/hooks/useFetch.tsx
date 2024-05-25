import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useFetch = (url: string) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
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

		fetchData();
	}, [url]);

	if (error && error.includes("Unauthorized")) {
		return { unauthorized: true };
	}

	return { data, loading, error };
};

export default useFetch;
