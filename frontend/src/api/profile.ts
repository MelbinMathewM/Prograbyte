import axiosInstance from "../axios/axiosConfig";

export const getProfile = async (userId: string) => {
    try{
        console.log(userId, 'userId');
        const response = await axiosInstance.get(`/user/profile/${userId}`);
        return response.data;
    }catch(error){ 
        console.error("Error fetching profile", error);
        throw error;
    }
}

export const updateProfileInfo = async (userId: string, data: any) => {
    console.log(data,'data');
    try {
        const response = await axiosInstance.patch(`/user/profile/${userId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating profile", error);
        throw error;
    }
}