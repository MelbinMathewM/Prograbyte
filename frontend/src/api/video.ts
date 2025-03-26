import axiosInstance from "@/configs/axiosConfig";

export const fetchToken = async (publicId: string) => {
    try {
        const response = await axiosInstance.get(`/course/topics/secure-token?publicId=${publicId}`);
        return response.data;
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};

export const getSecureUrl = async (token: string) => {
    try {
        const response = await axiosInstance.get(`/course/topics/secure-url/${token}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching secure video URL:", error);
        throw error;
    }
};
