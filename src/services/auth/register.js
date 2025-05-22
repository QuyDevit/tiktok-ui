import apiCall from "~/untils/httpRequest";

export const API_ENDPOINTS = {
  REGISTER_OTP_ENDPOINT: "auth/register/otp",
  REGISTER_USER_ENDPOINT: "auth/register/user",
};

export const registerotp = async (type, phoneNumber, email) => {
  try {
    const response = await apiCall(
      "POST",
      API_ENDPOINTS.REGISTER_OTP_ENDPOINT,
      { type, phoneNumber, email }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const registeruser = async (
  type,
  phoneNumber,
  email,
  password,
  dateOfBirth,
  verificationCode
) => {
  try {
    const response = await apiCall(
      "POST",
      API_ENDPOINTS.REGISTER_USER_ENDPOINT,
      { type, phoneNumber, email, password, dateOfBirth, verificationCode }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
