import axiosInstance from "@/configs/axiosConfig";

export const fetchCoupons = async () => {
    try{
        const response = await axiosInstance.get(`/course/coupons`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching coupons", err);
        throw err?.response?.data;
    }
};

export const postCoupon = async (code: string, discount: number, isLiveStream: boolean) => {
    try{
        const response = await axiosInstance.post(`/course/coupons`, { code, discount, isLiveStream });
        return response.data;
    }catch(err: any){
        console.error("Error adding coupons", err);
        throw err?.response?.data;
    }
};

export const applyCoupon = async (code: string, userId: string) => {
    try{
        const response = await axiosInstance.post(`/course/coupons/apply`, { code, userId });
        return response.data
    }catch(err: any){
        console.error("Error applying coupon", err);
        throw err?.response?.data;
    }
};

export const editCoupon = async (couponId: string, updateData: {code: string, discount: number, isLiveStream: boolean}) => {
    try{
        const response = await axiosInstance.put(`/course/coupons/${couponId}`, {updateData} );
        return response.data;
    }catch(err: any){
        console.error("Error updating coupons", err);
        throw err?.response?.data;
    }
};

export const removeCoupon = async (couponId: string) => {
    try{
        const response = await axiosInstance.delete(`/course/coupons/${couponId}`);
        return response.data;
    }catch(err: any){
        console.error("Error deleting coupons", err);
        throw err?.response?.data;
    }
};