import axiosInstance from "@/axios/axiosConfig";
import { Blog } from "@/types/blog";

export const getPosts = async () => {
    try {
        const response = await axiosInstance.get('/blog/post');
        return response.data;
    } catch (err) {
        console.error("Error fetching blogs", err);
        throw err;
    }
}

export const getBlogProfile = async (userId: string) => {
    console.log(userId,'ff')
    try{
        const response = await axiosInstance.get(`/blog/blog-profile/${userId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching blog profile", err);
    }
}

export const getMyBlogs = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/blog/post/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching user blogs", err);
        throw err;
    }
}

export const addPost = async (blogData: FormData, userId: string) => {
    try {
        const response = await axiosInstance.post(`/blog/post/${userId}`, blogData);
        return response.data;

    } catch (err) {
        console.error("Error creating blog", err);
        throw err;
    }
}

export const updateBlog = async (blogId: string, updateData: Partial<Blog>) => {
    try {
        const response = await axiosInstance.put(`/blog/post/${blogId}`, updateData);
        return response.data;
    } catch (err) {
        console.error("Error updating blog", err);
        throw err;
    }
}

export const deleteBlog = async (blogId: string) => {
    try {
        const response = await axiosInstance.delete(`/blog/post/${blogId}`);
        return response.data;
    } catch (err) {
        console.error("Error deleting blog", err);
        throw err;
    }
}

export const toggleBlogLike = async (blogId: string, userId: string) => {
    try {
        const response = await axiosInstance.patch(`/blog/post/${blogId}/like`, { userId });
        return response.data;
    } catch (err) {
        console.error("Error changing like status", err);
        throw err;
    }
}

export const getComments = async (blogId: string) => {
    try {
        const response = await axiosInstance.get(`/blog/post/${blogId}/comment`);
        return response.data;
    } catch (err) {
        console.error("Error fetching comments", err);
        throw err;
    }
}

export const addComment = async (blogId: string, userId: string, content: string, username: string) => {
    try {
        const response = await axiosInstance.post(`/blog/post/${blogId}/comment`, { userId, content, username });
        return response.data;
    } catch (err) {
        console.error("Error adding comment", err);
        throw err;
    }
}

export const deleteComment = async (blogId: string,commentId: string) => {
    try {
        console.log(blogId,'cc',commentId)
        const response = await axiosInstance.delete(`/blog/post/${blogId}/comment/${commentId}`);
        return response.data;
    } catch (err) {
        console.error("Error deleting comment", err);
        throw err;
    }
}

export const toggleCommentLike = async (blogId: string,commentId: string, userId: string) => {
    try {
        const response = await axiosInstance.patch(`/blog/post/${blogId}/comment/${commentId}`, { userId });
        return response.data;
    } catch (err) {
        console.error("Error changing like status", err);
        throw err;
    }
}