import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/v1", // calls your Next.js route handler
  timeout: 10000,
  withCredentials: false,
});

export default api;
