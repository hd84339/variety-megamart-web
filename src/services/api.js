import axios from "axios";

const API = axios.create({
  baseURL: "https://project.varietymegastore.com/api",
  timeout: 15000,
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Accept = "application/json";

    console.log("🚀 REQUEST:", config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE DEBUG
API.interceptors.response.use(
  (res) => {
    console.log("✅ RESPONSE:", res.config.url);
    return res;
  },
  (err) => {
    console.log("❌ API ERROR:", err.message);
    return Promise.reject(err);
  }
);

export default API;