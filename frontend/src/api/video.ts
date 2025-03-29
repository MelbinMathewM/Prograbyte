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

export const updateProgress = async (userId: string, courseId: string, topicId: string, watchedDuration: number, totalDuration: number) => {
    try{
        const response = await axiosInstance.post(`/course/enroll/${userId}/update-progress`, { courseId, topicId, watchedDuration, totalDuration});
        return response.data;
    }catch(err){
        console.error("Error updating progrees",err);
        throw err;
    }
}
