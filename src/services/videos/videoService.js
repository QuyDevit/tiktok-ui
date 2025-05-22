import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  POST_VIDEO_ENDPOINT: "video/upload",
  GET_LIST_VIDEO_ENDPOINT: "video/list",
  LIKE_VIDEO_ENDPOINT: "video/like",
};

export const postVideo = async (videoData) => {
  try {
    const response = await apiCall(
      "POST",
      API_ENDPOINTS.POST_VIDEO_ENDPOINT,
      videoData,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loadvideo = async (type = "for-you", page = "1") => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GET_LIST_VIDEO_ENDPOINT,
      { type, page }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const likevideo = async (videoId) => {
  try {
    const response = await apiCall("POST", API_ENDPOINTS.LIKE_VIDEO_ENDPOINT, {
      videoId,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
