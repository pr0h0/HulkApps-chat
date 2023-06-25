import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const client = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
