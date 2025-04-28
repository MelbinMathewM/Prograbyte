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
}