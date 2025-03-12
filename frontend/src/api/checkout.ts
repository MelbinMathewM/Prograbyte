import axiosInstance from "../axios/axiosConfig";


export const payCourse = async (amount: number, method: string) => {
    try{
        const response = await axiosInstance.post(`/course/payments`, {amount, method});
        return response.data;
    }catch(error){
        console.error("Error paying course", error);
        throw error;
    }
}

export const saveEnrolledCourse = async (courseId: string, userId: string, paymentAmount: number, paymentId: string) => {
    try{
        const response = await axiosInstance.post(`/course/enroll`, { courseId, userId, paymentAmount, paymentId });
        return response.data;
    }catch(error){
        console.error("error creating course", error);
        throw error;
    }
}