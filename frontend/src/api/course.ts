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

export const fetchCoursesByTutor = async (tutorId: string) => {
    try{
        const response = await axiosInstance.get(`/course/courses?tutor_id=${tutorId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching tutor courses");
        throw err;
    }
}