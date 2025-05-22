import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  LOGOUT_ENDPOINT: "auth/logout",
};

export const logoutuser = async () => {
  try {
    const response = await apiCall("GET", API_ENDPOINTS.LOGOUT_ENDPOINT);
    return response;
  } catch (error) {
    throw error;
  }
};
