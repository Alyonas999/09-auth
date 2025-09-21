import axios, { AxiosError } from "axios";
export type ApiError = AxiosError<{ error: string }>;

export const nextServer = axios.create({
  baseURL:
    (process.env.NEXT_PUBLIC_API_URL || "https://09-auth-teal.vercel.app/") +
    "/api",
  withCredentials: true,
});
