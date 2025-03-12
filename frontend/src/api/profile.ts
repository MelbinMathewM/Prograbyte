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

export const addSkill = async (userId: string, skill: string) => {
    try{
        const response = await axiosInstance.post(`/user/skills/${userId}`,{ skill });
        return response.data;
    }catch(error){
        console.error("Error adding skill");
        throw error;
    }
};

export const editSkill = async (userId: string, oldSkill: string, newSkill: string) => {
    try{
        const response = await axiosInstance.patch(`/user/skills/${userId}`,{ oldSkill, newSkill });
        return response.data;
    }catch(error){
        console.error("Error updating skill");
        throw error;
    }
};

export const deleteSkill = async (userId: string, skill: string) => {
    try{
        const response = await axiosInstance.delete(`/user/skills/${userId}/${skill}`);
        return response.data;
    }catch(error){
        console.error("Error deleting skill");
        throw error;
    }
};