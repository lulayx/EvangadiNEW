import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:7700/api",
  // baseURL: "https://evangadi-api.digitalyibeltal.com/api",
  headers: {
    // "Content-Type": "application/json",
  },
});

export default axiosInstance;
