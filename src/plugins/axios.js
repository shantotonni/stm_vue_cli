import axios from "axios";
import router from "@/router";
const api = axios.create({
    //baseURL: "https://backendevaluation.mcwh.online/api/",
     baseURL: "http://127.0.0.1:8000/api/",
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn("⚠️ No token found in localStorage");
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
        }
        return Promise.reject(error);
    }
);


export default api;