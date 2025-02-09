import apiCall from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    SEARCH_ENDPOINT:"search"
};


export const search = async (q,type ="less")=>{
    try {
        const response = await apiCall("GET",API_ENDPOINTS.SEARCH_ENDPOINT,{q,type});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}