import axios from "axios";

export const nextServer = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "https://09-auth-teal.vercel.app/") +
    "/api",
  withCredentials: true,
});
