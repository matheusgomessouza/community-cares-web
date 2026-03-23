import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.error(
    "NEXT_PUBLIC_API environment variable is not defined. Axios client will use relative URLs against the current origin."
  );
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

export default api;
