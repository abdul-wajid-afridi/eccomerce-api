import axios from "axios";

export const HttpUrl = axios.create({
  baseURL: "http://localhost:3009/api/v1/b2b",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  withCredentials: true,
});