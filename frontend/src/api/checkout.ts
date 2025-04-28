import axiosInstance from "../configs/axiosConfig";

export const payByWallet = async (courseId: string, userId: string, tutorId: string, paymentAmount: number, couponCode?: string) => {
    try{
        const response = await axiosInstance.post(`/payment/wallet/wallet-pay`, { courseId, userId, tutorId, paymentAmount, couponCode });
        return response.data;
    }catch(err: any){
        console.error("Error paying through wallet",err);
        throw err?.response?.data;
    }
}

export const saveEnrolledCourse = async (email: string, courseId: string, userId: string, tutorId: string, courseName: string, paymentAmount: number, couponCode?: string) => {
    try{
        const response = await axiosInstance.post(`/payment/payments/checkout/course`, { email, courseId, userId, tutorId, courseName, paymentAmount, couponCode });
        return response.data;
    }catch(error){
        console.error("error creating course", error);
        throw error;
    }
};

export const fetchWallet = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/payment/wallet/${userId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching wallet",err);
        throw err?.response?.data;
    }
};

