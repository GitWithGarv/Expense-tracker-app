import axios from "axios";

export const http = axios.create({
  baseURL: "", // ✅ FIXED FOR PROXY
  withCredentials: true,
});