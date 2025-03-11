import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchCsrfToken = async () => {
  try {
    const res = await api.get("/csrf-token");
    api.defaults.headers["X-CSRF-Token"] = res.data.csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token:", err);
  }
};

export default api;