import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "@/configs/axiosConfig";
import { useTheme } from "@/contexts/theme-context";
import VideoPlayer from "./video-player";
import { Topic } from "@/types/course";
import { AdminContext } from "@/contexts/admin-context";
const VideoPart = () => {
    const { courseName, topicId, topicsId } = useParams();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [topic, setTopic] = useState<Topic | null>(null);
    const { admin } = useContext(AdminContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const navigate = useNavigate();

    // const accessToken = useSelector((state: any) => state.auth.accessToken);

    useEffect(() => {
        const fetchTopic = async () => {
            if (!topicId) return;
            try {
                const response = await axiosInstance.get(`/course/topics/${topicsId}/${topicId}`);
                console.log(response.data);
                setTopic(response.data);
            } catch (error) {
                console.log("Error fetching topic");
            }
        };
        fetchTopic();
    }, [topicId]);

    return (
        <div className={`${isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"} mx-auto p-6`}>
            {/* Breadcrumb Navigation */}
            <nav
                className={`p-6 rounded mb-4 text-sm flex items-center 
                    ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"}`}
            >
                <Link to="/home" className="font-bold hover:text-blue-500">
                    Home
                </Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">
                    Courses
                </Link>
                <ChevronRight size={16} />
                <Link to={`/courses/${topicsId}`} className="font-bold hover:text-blue-500">
                    {courseName}
                </Link>
                <ChevronRight size={16} />
                <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>{topic?.title}</span>
            </nav>

            {/* Title and Back Button */}
            <div className="flex w-full sm:max-w-6xl sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{topic?.title}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </button>
            </div>

            {/* Video Player Component */}
            <VideoPlayer publicId={topic?.video_url as string} isDark={isDark} userId={admin?.id as string} courseId={courseId as string} topicId={topic?._id as string} />
        </div>
    );
};

export default VideoPart;