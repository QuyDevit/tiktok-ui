import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  GETINFO_USER_ENDPOINT: "user/me",
  GETINFO_ACCOUNT_ENDPOINT: "user/",
};

export const getInfoUser = async () => {
  try {
    const response = await apiCall("GET", API_ENDPOINTS.GETINFO_USER_ENDPOINT);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInfoAccount = async (nickname) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GETINFO_ACCOUNT_ENDPOINT,
      { nickname }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
