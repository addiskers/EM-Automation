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
    api.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken;
    return res.data.csrfToken;
  } catch (err) {
    console.error("Failed to fetch CSRF token:", err);
    throw err;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
      if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const token = await fetchCsrfToken();
        originalRequest.headers["X-CSRF-Token"] = token;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;