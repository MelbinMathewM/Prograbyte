import axiosInstance from "../axios/axiosConfig";

export const fetchToken = async (publicId: string) => {
    console.log(publicId,'publicId2')
    try{
        const response = await axiosInstance.get(`/course/secure-video-token?publicId=${publicId}`);
        return response.data;
    }catch(error){
        console.error("Error generating token:", error);
        throw error;
    }
}

export const getSecureUrl = async (token: string) => {
    console.log(token,'token')
    try{
        const response = await axiosInstance.get(`/course/secure-video/${token}`);
        return response.data;
    }catch(error){
        console.error("Error fetching secure video URL:", error);
        throw error;
    }
}