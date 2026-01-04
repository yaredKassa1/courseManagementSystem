import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Blocked by: ", error.response.status); 
      // localStorage.clear(); // Comment this temporarily to see the error in console
      // window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;