import axiosInstance from "@/configs/axiosConfig";

export const fetchOffers = async () => {
    try{
        const response = await axiosInstance.get(`/course/offers`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching offers", err);
        throw err?.response?.data;
    }
};

export const postOffer = async (offerData: {title: string, description: string, discount: number, expiryDate: string}) => {
    try{
        const response = await axiosInstance.post(`/course/offers`, offerData);
        return response.data;
    }catch(err: any){
        console.error("Error adding offer", err);
        throw err?.response?.data;
    }
};

export const editOffer = async (offerId: string, updateData: {title: string, description: string, discount: number, expiryDate: string}) => {
    try{
        const response = await axiosInstance.put(`/course/offers/${offerId}`, {updateData} );
        return response.data;
    }catch(err: any){
        console.error("Error updating offers", err);
        throw err?.response?.data;
    }
};

export const removeOffer = async (offerId: string) => {
    try{
        const response = await axiosInstance.delete(`/course/offers/${offerId}`);
        return response.data;
    }catch(err: any){
        console.error("Error deleting offers", err);
        throw err?.response?.data;
    }
};

export const applyOfferToCourse = async (courseId: string, offerId: string) => {
    try{
        const response = await axiosInstance.post(`/course/offers/apply`, { courseId, offerId });
        return response.data;
    }catch(err: any){
        console.error("Error applying offer to course",err);
        throw err?.response?.data;
    }
};

export const removeOfferFromCourse = async (courseId: string) => {
    try{
        const response = await axiosInstance.post(`/course/offers/remove`, { courseId });
        return response.data;
    }catch(err: any){
        console.error("Error removing offer from course",err);
        throw err?.response?.data;
    }
};