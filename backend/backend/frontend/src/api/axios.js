import axios from "axios";

const API = axios.create({
  baseURL: "https://codehub-icr1.onrender.com/api",
  withCredentials: true,
});

// Add JWT Token Automatically

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

export default API;
