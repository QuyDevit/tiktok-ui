import axios from "axios";
import { authcookie } from "~/helpers";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.REACT_APP_API_KEY,
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const refreshToken = async () => {
  try {
    await axiosInstance.post("/auth/refreshtoken");
    processQueue(null);
    return true;
  } catch (error) {
    processQueue(error);
    return false;
  } finally {
    isRefreshing = false;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const success = await refreshToken();

      if (success) {
        authcookie.setRefreshTokenExpiry();
        return axiosInstance(originalRequest);
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const apiCall = async (
  method,
  endpoint,
  payload = null,
  headers = {},
  options = { silent: false }
) => {
  try {
    const response = await axiosInstance({
      method,
      url: endpoint,
      ...(method === "GET" || method === "DELETE"
        ? { params: payload }
        : { data: payload }),
      headers: { ...axiosInstance.defaults.headers, ...headers },
    });
    return response.data;
  } catch (error) {
    // console.error("API call error:", error);
    throw error;
  }
};

export default apiCall;
