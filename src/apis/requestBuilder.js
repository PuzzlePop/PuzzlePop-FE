import axios from "axios";

const { VITE_SERVER_END_POINT, VITE_DEV_SERVER_END_POINT } = import.meta.env;

const SERVER_END_POINT = import.meta.env.DEV ? VITE_DEV_SERVER_END_POINT : VITE_SERVER_END_POINT;

export const request = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: SERVER_END_POINT,
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});
