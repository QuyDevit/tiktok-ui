import {apiCall2} from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    SEARCH_ENDPOINT:"user/search"
};


export const search = async (q,type ="less")=>{
    try {
        const response = await apiCall2("GET",API_ENDPOINTS.SEARCH_ENDPOINT,{q,type});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}