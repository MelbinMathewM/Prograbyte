import axiosInstance from "../configs/axiosConfig";

export const getProfile = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/user/profile/${userId}`);
        return response.data;
    }catch(error: any){ 
        console.error("Error fetching profile", error);
        throw error?.response?.data;
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

export const verifyEmail = async (email: string) => {
    try{
        const response = await axiosInstance.post(`/user/verify-email-link`, { email });
        return response.data;
    }catch(err){
        console.error("Error sending verification email",err);
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
};

export const getUserDataContext = async () => {
    try{
        const response = await axiosInstance.get(`/user/user`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching user context details",err);
        throw err?.response?.data;
    }
};

export const fetchTutors = async () => {
    try{
        const response = await axiosInstance.get(`/user/tutors`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching tutor list",err);
        throw err?.response?.data;
    }
};

export const changeTutorStatus = async (tutorId: string, action: string) => {
    try{
        const response = await axiosInstance.patch(`/user/tutors/${tutorId}/status`, { action });
        return response.data;
    }catch(err: any){
        console.error("Error changing tutor status",err);
        throw err?.response?.data;
    }
};

export const fetchUsers = async () => {
    try{
        const response = await axiosInstance.get(`/user/users`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching user list",err);
        throw err?.response?.data;
    }
};

export const changeUserStatus = async (userId: string, action: string) => {
    try{
        const response = await axiosInstance.patch(`/user/users/${userId}/status`, { action });
        return response.data;
    }catch(err: any){
        console.error("Error changing user status",err);
        throw err?.response?.data;
    }
};

export const updateToPremium = async (email: string) => {
    try{
        const response = await axiosInstance.post(`/payment/payments/checkout/premium`, { email });
        return response.data;
    }catch(err: any){
        console.error("error updating to premium",err);
        throw err?.response?.data;
    }
}