import apiCall from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    VIDEOS_ENDPOINT:"videos"
};


export const loadvideo = async (type='for-you',page ="1")=>{
    try {
        const response = await apiCall("GET",API_ENDPOINTS.VIDEOS_ENDPOINT,{type,page});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}