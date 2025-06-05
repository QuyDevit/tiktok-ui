import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  GETINFO_USER_ENDPOINT: "user/me",
  GETINFO_ACCOUNT_ENDPOINT: "user/",
  GETINFO_LISTFRIEND_ENDPOINT: "user/getfriends",
  GETINFO_LISTFUSER_ENDPOINT: "user/getinfousers",
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
export const getListFriend = async () => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GETINFO_LISTFRIEND_ENDPOINT
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getListUserRoom = async (userIds) => {
  try {
    const response = await apiCall(
      "GET",
      API_ENDPOINTS.GETINFO_LISTFUSER_ENDPOINT,
      { userIds: userIds.join(",") }
    );
    return response;
  } catch (error) {
    console.error("Error in getListUserRoom:", error);
    throw error;
  }
};
