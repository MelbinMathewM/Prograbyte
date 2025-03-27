import axiosInstance from "../configs/axiosConfig";

export const fetchCourseDetail = async (courseId: string) => {
    try{
        const response = await axiosInstance.get(`/course/courses/${courseId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching course data",err);
        throw err;
    }
}

export const fetchTopicsByCourse = async (courseId: string) => {
    try{
        const response = await axiosInstance.get(`/course/topics/${courseId}`);
        return response.data;
    }catch(err){
        console.error("Error fetching topics", err);
        throw err;
    }
}

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