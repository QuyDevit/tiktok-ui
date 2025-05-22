import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  UPDATE_NICKNAME_ENDPOINT: "user/updatename",
  UPDATE_PROFILE_ENDPOINT: "user/updateinfo",
};

export const updateNickname = async (nickname) => {
  try {
    const response = await apiCall(
      "PATCH",
      API_ENDPOINTS.UPDATE_NICKNAME_ENDPOINT,
      { nickname }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateInfo = async (formData) => {
  try {
    const response = await apiCall(
      "PATCH",
      API_ENDPOINTS.UPDATE_PROFILE_ENDPOINT,
      formData,
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
