import apiCall from "~/untils/httpRequest" 

export const API_ENDPOINTS = {
    SUGGESTACCOUNT_ENDPOINT:"users/suggested"
};


export const suggest = async (page='1',per_page)=>{
    try {
        const response = await apiCall("GET",API_ENDPOINTS.SUGGESTACCOUNT_ENDPOINT,{page,per_page});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}