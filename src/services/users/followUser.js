import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  FOLLOW_USER_ENDPOINT: "user/follow",
};

export const followUser = async (userId) => {
  try {
    const response = await apiCall("POST", API_ENDPOINTS.FOLLOW_USER_ENDPOINT, {
      userId,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
