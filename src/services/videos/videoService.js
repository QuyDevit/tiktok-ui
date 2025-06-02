import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  POST_VIDEO_ENDPOINT: "video/upload",
  GET_LIST_VIDEO_ENDPOINT: "video/list",
  GET_LIST_VIDEO_USER_ENDPOINT: "video/user",
  LIKE_VIDEO_ENDPOINT: "video/like",
  COMMENT_VIDEO_ENDPOINT: "comment",
  GET_LIST_COMMENT_ENDPOINT: "comment/list",
  GET_LIST_COMMENT_DETAIL_ENDPOINT: "comment/detail",
  LIKE_COMMENT_ENDPOINT: "comment/like",
  GET_VIDEO_DETAIL_ENDPOINT: "video/detail",
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

export const loadvideo = async (type, searchAfter = null) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GET_LIST_VIDEO_ENDPOINT,
      {
        type,
        searchAfter,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const loadvideouser = async (userId, searchAfter = null) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GET_LIST_VIDEO_USER_ENDPOINT,
      {
        userId,
        searchAfter,
      }
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
export const likecomment = async (commentId) => {
  try {
    const response = await apiCall(
      "POST",
      API_ENDPOINTS.LIKE_COMMENT_ENDPOINT,
      {
        commentId,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const loadvideoDetail = async (videoId) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GET_VIDEO_DETAIL_ENDPOINT,
      {
        videoId,
      }
    );
    return response;
  } catch (error) {
    // console.error(error);
    throw error;
  }
};

export const loadcomment = async (videoId, lastCreatedAt = null) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GET_LIST_COMMENT_ENDPOINT,
      {
        videoId,
        lastCreatedAt,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const commentvideo = async (
  videoId,
  content,
  parentCommentId = null
) => {
  try {
    const response = await apiCall(
      "POST",
      API_ENDPOINTS.COMMENT_VIDEO_ENDPOINT,
      {
        videoId,
        content,
        parentCommentId,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const loadcommendetail = async (commentId, lastCreatedAt = null) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GET_LIST_COMMENT_DETAIL_ENDPOINT,
      {
        commentId,
        lastCreatedAt,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
