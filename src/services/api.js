import axios from "axios";

const API = axios.create({
  baseURL: "https://project.varietymegastore.com/api",
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    /**
     * Logic: Only attach the Authorization header if the endpoint is protected.
     * All protected routes in this backend start with "/auth/".
     * Sending tokens to public routes (like /getHomeData) can cause errors.
     */
    if (token && config.url.includes("/auth/")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API REQUEST: ${config.method.toUpperCase()} ${config.url}`, config.headers);
    config.headers.Accept = "application/json";
    return config;

  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR FOR DEBUGGING
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error(`🚨 404 NOT FOUND: ${error.config.method.toUpperCase()} ${error.config.url}`);
    }
    return Promise.reject(error);
  }
);

export default API;


