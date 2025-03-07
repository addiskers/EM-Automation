import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Allow sending cookies for CSRF
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch CSRF Token and attach it to future requests
export const fetchCsrfToken = async () => {
  try {
    const res = await api.get("/csrf-token");
    api.defaults.headers["X-CSRF-Token"] = res.data.csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token:", err);
  }
};

export default api;
