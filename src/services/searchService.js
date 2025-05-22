import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  SEARCH_USER_ENDPOINT: "user/search",
  SEARCH_VIDEO_ENDPOINT: "video/search",
};

export const searchUser = async (q, type = "less") => {
  try {
    const response = await apiCall("GET", API_ENDPOINTS.SEARCH_USER_ENDPOINT, {
      q,
      type,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchVideo = async (q, type = "less") => {
  try {
    const response = await apiCall("GET", API_ENDPOINTS.SEARCH_VIDEO_ENDPOINT, {
      q,
      type,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
