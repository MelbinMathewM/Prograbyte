import axiosInstance from "@/configs/axiosConfig";

export const getPaymentData = async () => {
    try{
        const response = await axiosInstance.get(`/payment/payments/monthly-payments`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching payment details",err);
        throw err?.response?.data;
    }
};

export const payTutor = async (payoutId: string) => {
    try{
        const response = await axiosInstance.post(`/payment/payments/pay-tutor`, { payoutId });
        return response.data;
    }catch(err: any){
        console.error("Error paying tutor",err);
        throw err?.response?.data;
    }
};

export const revokePremium = async (userId: string) => {
    try{
        const response = await axiosInstance.post(`/payment/wallet/revoke`, { userId });
        return response.data;
    }catch(err: any){
        console.error("Error revoking premium membership",err);
        err?.response?.data;
    }
}

export const getDashboardData = async () => {
    try{
        const response = await axiosInstance.get(`/payment/payments/dashboard`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching dashboard data",err);
        throw err?.response?.data;
    }
}

export const getTutorDashboardData = async (tutorId: string) => {
    try{
        const response = await axiosInstance.get(`/payment/payments/dashboard/tutor/${tutorId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching tutor dashboard data",err);
        throw err?.response?.data;
    }
}