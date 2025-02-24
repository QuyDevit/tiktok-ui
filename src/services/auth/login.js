import {apiCall2} from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    LOGIN_ENDPOINT:"auth/login",
};

export const authlogin = async (type,userName,password)=>{
     
    try {
        const response = await apiCall2("POST",API_ENDPOINTS.LOGIN_ENDPOINT,{type,userName,password});
        return response;
    } catch (error) {
        throw error;
    }
}