import axiosInstance from "../configs/axiosConfig";

export const addToWishlist = async (userId: string, courseId: string) => {
    try {
        const response = await axiosInstance.post(`/course/wishlist`, { userId,courseId });
        return response.data;
    } catch (error) {
        console.error("Error adding to wishlist", error);
        throw error;
    }
};

export const removeFromWishlist = async (userId: string, courseId: string) => {
    try {
        const response = await axiosInstance.delete(`/course/wishlist/${userId}/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing from wishlist", error);
        throw error;
    }
};

export const getWishlist = async (userId: string) => {
    try {
        const response = await axiosInstance.get(`/course/wishlist/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist", error);
        throw error;
    }
};
