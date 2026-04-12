import axios from "axios";

const isProduction = import.meta.env.PROD;

export const http = axios.create({
  baseURL: isProduction 
    ? "https://expense-tracker-backend-sm1i.onrender.com" 
    : "", 
  withCredentials: true,
});