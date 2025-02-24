import {apiCall2} from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    UPDATE_NICKNAME_ENDPOINT:"user/updatename",
};

export const updateNickname = async (nickname)=>{
    try {
        const response = await apiCall2("PATCH",API_ENDPOINTS.UPDATE_NICKNAME_ENDPOINT,{nickname});
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}