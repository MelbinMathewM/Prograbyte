import axiosInstance from "@/configs/axiosConfig";
import { Blog } from "@/types/blog";

export const getPosts = async () => {
    try {
        const response = await axiosInstance.get('/blog/post');
        return response.data;
    } catch (err: any) {
        console.error("Error fetching blogs", err);
        throw err?.response?.data;
    }
}

export const getBlogProfile = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/blog/blog-profile/${userId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching blog profile", err);
        throw err?.response?.data;
    }
}

export const getMyBlogs = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/blog/post/${userId}`);
        return response.data;
    } catch (err: any) {
        console.error("Error fetching user blogs", err);
        throw err?.response?.data;
    }
}

export const addPost = async (blogData: FormData) => {
    try {
        const response = await axiosInstance.post(`/blog/post`, blogData);
        return response.data;
    } catch (err: any) {
        console.error("Error creating blog", err);
        throw err?.response?.data;
    }
}

export const updateBlog = async (blogId: string, updateData: Partial<Blog>) => {
    try {
        const response = await axiosInstance.put(`/blog/post/${blogId}`, updateData);
        return response.data;
    } catch (err: any) {
        console.error("Error updating blog", err);
        throw err?.response?.data;
    }
}

export const deleteBlog = async (blogId: string) => {
    try {
        const response = await axiosInstance.delete(`/blog/post/${blogId}`);
        return response.data;
    } catch (err: any) {
        console.error("Error deleting blog", err);
        throw err?.response?.data;
    }
}

export const toggleBlogLike = async (blogId: string, userId: string) => {
    try {
        const response = await axiosInstance.patch(`/blog/post/${blogId}/like`, { userId });
        return response.data;
    } catch (err: any) {
        console.error("Error changing like status", err);
        throw err?.response?.data;
    }
}

export const getComments = async (blogId: string) => {
    try {
        const response = await axiosInstance.get(`/blog/post/${blogId}/comment`);
        return response.data;
    } catch (err: any) {
        console.error("Error fetching comments", err);
        throw err?.response?.data;
    }
}

export const addComment = async (blogId: string, userId: string, content: string, username: string) => {
    try {
        const response = await axiosInstance.post(`/blog/post/${blogId}/comment`, { userId, content, username });
        return response.data;
    } catch (err: any) {
        console.error("Error adding comment", err);
        throw err?.response?.data;
    }
}

export const editComment = async (blogId: string, commentId: string, content: string) => {
    try{
        const response = await axiosInstance.put(`/blog/post/${blogId}/comment/${commentId}`, { content });
        return response.data;
    }catch(err: any){
        console.error("Error updating comment",err);
        throw err?.response?.data;
    }
}

export const deleteComment = async (blogId: string,commentId: string) => {
    try {
        const response = await axiosInstance.delete(`/blog/post/${blogId}/comment/${commentId}`);
        return response.data;
    } catch (err: any) {
        console.error("Error deleting comment", err);
        throw err?.response?.data;
    }
}

export const toggleCommentLike = async (blogId: string,commentId: string, userId: string) => {
    try {
        const response = await axiosInstance.patch(`/blog/post/${blogId}/comment/${commentId}/like`, { userId });
        return response.data;
    } catch(err: any) {
        console.error("Error changing like status", err);
        throw err?.response?.data;
    }
}

export const addSubComment = async (blogId: string, commentId: string, userId: string, content: string, username: string) => {
    try{
        const response = await axiosInstance.post(`/blog/post/${blogId}/comment/${commentId}`, { userId, content, username });
        return response.data;
    } catch(err: any) {
        console.error("Error adding sub comment", err);
        throw err?.response?.data;
    }
}

export const toggleSubCommentLike = async (blogId: string, commentId: string, subCommentId: string, userId: string) => {
    try{
        const response = await axiosInstance.patch(`/blog/post/${blogId}/comment/${commentId}/sub-comment/${subCommentId}/like`, { userId });
        return response.data;
    } catch(err: any) {
        console.error("Error adding like to the subcomment", err);
        throw err?.response?.data;
    }
}

export const deleteSubComment = async (blogId: string,commentId: string, subCommentId: string) => {
    try {
        const response = await axiosInstance.delete(`/blog/post/${blogId}/comment/${commentId}/sub-comment/${subCommentId}`);
        return response.data;
    } catch (err: any) {
        console.error("Error deleting sub comment", err);
        throw err?.response?.data;
    }
}