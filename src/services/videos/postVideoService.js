import { apiCall2 } from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  POST_VIDEO_ENDPOINT: "video/upload",
};

export const postVideo = async (videoData) => {
  try {
    const response = await apiCall2(
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
