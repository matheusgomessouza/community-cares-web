import axios from "axios";

export const githubInstance = axios.create({
  baseURL: "https://github.com",
});
