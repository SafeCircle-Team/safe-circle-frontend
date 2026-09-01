const API_BASE_URL = "http://localhost:5000/api";

const api = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
            ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await response.json();

    if (!response.ok) {
        console.log("API Error Response:", JSON.stringify(data,null,2));
        throw new Error(data.message || "Something went wrong")
    }
    return data;

};

export default api;