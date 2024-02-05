import axios from "axios";

export const request = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "http://localhost:8082",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});
