import axiosInstance from "../configs/axiosConfig";

export const fetchCourses = async (params: any) => {
    try{
        const response = await axiosInstance.get(`/course/courses`, { params });
        return response.data;
    }catch(err){
        console.log("Error fetching courses",err);
        throw err;
    }
}

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

export const fetchReviews = async (courseId: string) => {
    try{
        const response = await axiosInstance.get(`/course/courses/rating/${courseId}`);
        return response.data;
    }catch(err){
        console.error("Failed to fetch reviews", err);
        throw err;
    }
}

export const fetchCategories = async () => {
    try{
        const response = await axiosInstance.get(`/course/categories`);
        return response.data;
    }catch(err){
        console.error("Failed to fetch categories",err);
        throw err;
    }
}