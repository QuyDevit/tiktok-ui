import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: process.env.REACT_APP_URL_API,
  baseURL: "https://tiktok.fullstack.edu.vn/api/",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.REACT_APP_API_KEY,
  },
});

const axiosInstance2 = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.REACT_APP_API_KEY,
  },
  withCredentials: true,
});
export const apiCall2 = async (
  method,
  endpoint,
  payload = null,
  headers = {}
) => {
  try {
    const response = await axiosInstance2({
      method,
      url: endpoint,
      ...(method === "GET" || method === "DELETE"
        ? { params: payload }
        : { data: payload }),
      headers: { ...axiosInstance2.defaults.headers, ...headers },
    });
    return response.data;
  } catch (error) {
    // console.error("API call error:", error);
  }
};
const apiCall = async (method, endpoint, params = null, headers = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url: endpoint,
      params,
      headers: { ...axiosInstance.defaults.headers, ...headers },
    });
    return response.data;
  } catch (error) {
    console.error("API call error:", error);
  }
};

export default apiCall;
