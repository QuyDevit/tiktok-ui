import {apiCall2} from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    LOGIN_ENDPOINT:"auth/login",
    OTP_ENDPOINT:"auth/login/otp",
};

export const authlogin = async (type,userName,password,isOtp=false)=>{
     
    try {
        const response = await apiCall2("POST",API_ENDPOINTS.LOGIN_ENDPOINT,{type,userName,password,isOtp});
        return response;
    } catch (error) {
        throw error;
    }
}
export const sendotp = async (phoneNumber)=>{  
    try {
        const response = await apiCall2("POST",API_ENDPOINTS.OTP_ENDPOINT,{phoneNumber});
        return response;
    } catch (error) {
        throw error;
    }
}