import axiosInstance from "@/configs/axiosConfig";

export const fetchConversation = async (user1Id: string, user2Id: string) => {
    try{
        const response = await axiosInstance.post(`/blog/blog-profile/chat/conversation`,{user1Id, user2Id});
        return response.data;
    }catch(err){
        console.error("Error fetching conversation",err);
        throw err;
    }
}

export const fetchMutualConnections = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/blog/blog-profile/${userId}/mutual-follow`);
        return response.data;
    }catch(err){
        console.error("Error fetching mutual connections",err);
        throw err;
    }
}

export const fetchMessages = async (conversationId: string, limit: number) => {
    console.log(conversationId, 'cc',limit);
    try{
        const response = await axiosInstance.get(`/blog/blog-profile/chat/conversation/${conversationId}`,{ params: {limit} });
        return response.data;
    }catch(err){
        console.error("Error fetching user messages",err);
        throw err;
    }
}