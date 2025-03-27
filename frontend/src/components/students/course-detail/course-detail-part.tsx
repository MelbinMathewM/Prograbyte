import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import TabNav from "@/components/students/course-detail/course-detail-tabnav";
import { Course } from "@/types/course";
import { fetchCourseDetail } from "@/api/course";

const StudentCourseDetailPart = () => {
    
    const [course, setCourse] = useState<Course | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const { id } = useParams();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetchCourseDetail(id as string);
                setCourse(response.course);
            } catch (err: any) {
                console.error(err.response.data.error);
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

            <div className="flex w-full justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{course?.title}</h2>
                <Link to="/courses" className="flex shadow-md text-blue-500 font-bold px-4 py-2 rounded-md hover:text-white hover:bg-blue-400">
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </Link>
            </div>

            {course?.poster_url && course?.preview_video_urls && (
                <div className="grid md:grid-cols-2 mx-auto gap-6 mt-6">
                    {/* Poster / Video Section */}
                    <div className="relative rounded-lg shadow-lg overflow-hidden cursor-pointer">
                        {showVideo ? (
                            <video 
                                controls 
                                autoPlay
                                className="w-full h-48 md:h-full rounded-lg"
                                onEnded={() => setShowVideo(false)}
                            >
                                <source src={course?.preview_video_urls?.[0]} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="relative w-full h-48 md:h-full rounded-lg overflow-hidden">
                                <img 
                                    src={course?.poster_url} 
                                    alt="Course Poster" 
                                    className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:brightness-75"
                                    onClick={() => setShowVideo(true)}
                                />
                                {/* Overlay & Play Button */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <button 
                                        className="bg-black/60 p-4 rounded-full hover:bg-black/80 transition"
                                        onClick={() => setShowVideo(true)}
                                    >
                                        <PlayCircle size={48} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <TabNav course={course} isDark={isDark as boolean} />
        </div>
    );
};

export default StudentCourseDetailPart;
