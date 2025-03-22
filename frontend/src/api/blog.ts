import axiosInstance from "@/axios/axiosConfig";
import { Blog } from "@/types/blog";

export const getPosts = async () => {
    try{
        const response = await axiosInstance.get('/blog/post');
        return response.data;
    }catch(err){
        console.error("Error fetching blogs", err);
        throw err;
    }
}

export const getMyBlogs = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/blog/post/${userId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching user blogs", err);
        throw err;
    }
}

export const addPost = async (blogData: Partial<Blog>) => {
    try{
        const response = await axiosInstance.post('/blog/post',blogData);
        return response.data;

    }catch(err){
        console.error("Error creating blog", err);
        throw err;
    }
}

export const updateBlog = async (blogId: string, updateData: Partial<Blog>) => {
    try{
        const response = await axiosInstance.put(`/blog/post/${blogId}`,updateData);
        return response.data;
    }catch(err){
        console.error("Error updating blog", err);
        throw err;
    }
}

export const deleteBlog = async (userId: string, blogId: string) => {
    try{
        const response = await axiosInstance.delete(`/blog/post/${userId}/${blogId}`);
        return response.data;
    }catch(err){
        console.error("Error deleting blog", err);
        throw err;
    }
}