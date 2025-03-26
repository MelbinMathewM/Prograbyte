import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../configs/axiosConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import TabNav from "./course-detail-tabnav";
import { Course } from "../../types/course";

const StudentCourseDetailPart = () => {
    // const [coupon, setCoupon] = useState("");
    const [course, setCourse] = useState<Course | null>(null);
    const { id } = useParams();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/course/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                console.error("Error fetching course details");
            }
        };
        fetchCourse();
    }, [id]);

    return (
        <div className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"} mx-auto p-6`}>
            <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-500"} p-6 rounded mb-4 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">Courses</Link>
                <ChevronRight size={16} />
                <span>{course?.title}</span>
            </nav>
            <div className="flex w-full sm:max-w-6xl sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{course?.title}</h2>
                <Link to="/courses" className="flex shadow-md text-red-500 font-bold px-4 py-2 rounded-md hover:text-white hover:bg-red-500">
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </Link>
            </div>
            {course?.poster_url && course?.preview_video_urls && (
                <div className="grid md:grid-cols-2 max-w-6xl mx-auto gap-6 mt-6">
                    <div>
                        <img src={course?.poster_url} alt="Course Poster" className="w-full max-w-xl h-48 md:h-full rounded-lg shadow-lg object-cover" />
                    </div>
                    <div>
                        <video controls className="w-full h-48 md:h-full rounded-lg">
                            <source src={course?.preview_video_urls?.[0]} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
            <TabNav course={course} isDark={isDark as boolean} />
        </div>
    );
};

export default StudentCourseDetailPart; 