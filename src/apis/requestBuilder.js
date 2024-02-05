import axios from "axios";

export const request = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://i10a304.p.ssafy.io/api",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});
