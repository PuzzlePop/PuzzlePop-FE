import axios from "axios";

export const request = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});
