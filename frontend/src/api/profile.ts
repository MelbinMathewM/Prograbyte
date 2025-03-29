import axiosInstance from "../configs/axiosConfig";

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
        console.log(oldSkill,newSkill,'vv')
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

export const getEnrolledCourses = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/course/enroll/${userId}`);
        return response.data;
    }catch(error){
        console.log('Error fetching enrolled courses');
        throw error;
    }
}

export const getPublicProfile = async (username: string) => {
    try{
        const response = await axiosInstance.get(`/blog/blog-profile/public/${username}`);
        return response.data;
    }catch(err){
        console.error("Error fetching user profile", err);
        throw err;
    }
}

export const followUser = async (userId: string, followerId: string) => {
    try{
        const response = await axiosInstance.post(`/blog/blog-profile/${userId}/follow`,{ followerId });
        return response.data;
    }catch(err){
        console.error("Error following user",err);
        throw err;
    }
}

export const unfollowUser = async (userId: string, followerId: string) => {
    try{
        const response = await axiosInstance.post(`/blog/blog-profile/${userId}/unfollow`, { followerId });
        return response.data;
    }catch(err){
        console.error("Error unfollowing user",err);
        throw err;
    }
}

export const getUserData = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/user/user/${userId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching user data", err);
        throw err;
    }
}