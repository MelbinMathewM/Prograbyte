import axiosInstance from "@/configs/axiosConfig";

export const fetchCourses = async (params?: any) => {
    try{
        const response = await axiosInstance.get(`/course/courses`, { params });
        return response.data;
    }catch(err: any){
        console.log("Error fetching courses",err);
        throw err.response.data;
    }
};

export const fetchCourseDetail = async (courseId: string) => {
    try{
        const response = await axiosInstance.get(`/course/courses/${courseId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching course data",err);
        throw err.response.data;
    }
};

export const fetchTopicsByCourse = async (courseId: string) => {
    try{
        const response = await axiosInstance.get(`/course/topics/${courseId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching topics", err);
        throw err.response.data;
    }
};

export const fetchEnrolledCourse = async (userId: string) => {
    try{
        const response = await axiosInstance.get(`/course/enroll/${userId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching enrolled courses");
        throw err.response.data;
    }
};

export const fetchCoursesByTutor = async (tutorId: string) => {
    try{
        const response = await axiosInstance.get(`/course/courses?tutor_id=${tutorId}`);
        return response.data;
    }catch(err: any){
        console.error("Error fetching tutor courses");
        throw err.response.data;
    }
};

export const refundEnrolledCourse = async (userId: string, courseId: string) => {
    try{
        const response = await axiosInstance.post(`/course/enroll/cancel`, { userId, courseId });
        return response.data;
    }catch(err: any){
        console.error("Error refunding course",err);
        throw err?.response?.data;
    }
};

export const fetchReviews = async (courseId: string) => {
    try{
        const response = await axiosInstance.get(`/course/courses/rating/${courseId}`);
        return response.data;
    }catch(err: any){
        console.error("Failed to fetch reviews", err);
        throw err.response.data;
    }
};

export const fetchCategories = async () => {
    try{
        const response = await axiosInstance.get(`/course/categories`);
        return response.data;
    }catch(err: any){
        console.error("Failed to fetch categories",err);
        throw err.response.data;
    }
};

export const postCategories = async (name: string, type: string) => {
    try{
        const response = await axiosInstance.post(`/course/categories`, { name, type });
        return response.data;
    }catch(err: any){
        console.error("Failed to insert categories",err);
        throw err.response.data;
    }
};

export const editCategories = async (categoryId: string, name: string, type: string) => {
    try{
        const response = await axiosInstance.put(`/course/categories/${categoryId}`, { name, type });
        return response.data;
    }catch(err: any){
        console.error("Failed to update category", err);
        throw err.response.data;
    }
};

export const deleteCategories = async (categoryId: String) => {
    try{
        const response = await axiosInstance.delete(`/course/categories/${categoryId}`);
        return response.data;
    }catch(err: any){
        console.error("Failed to delete category", err);
        throw err.response.data;
    }
};

