import {apiCall2} from "~/untils/httpRequest"

export const API_ENDPOINTS = {
    GETINFO_USER_ENDPOINT:"user/me",
};

export const getInfoUser = async ()=>{
    try {
        const response = await apiCall2("GET",API_ENDPOINTS.GETINFO_USER_ENDPOINT);
        return response;
    } catch (error) {
        throw error;
    }
}