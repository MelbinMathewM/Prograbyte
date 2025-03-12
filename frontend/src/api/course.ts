import axiosInstance from "../axios/axiosConfig";

export const fetchEnrolledCourse = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/course/enroll/${userId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching enrolled courses");
        throw err;
    }
}