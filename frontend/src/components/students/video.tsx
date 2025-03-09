import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";
import { useTheme } from "../../contexts/theme-context";

interface Topic {
    _id: string;
    course_id: string;
    title: string;
    level: "Basic" | "Intermediate" | "Advanced";
    video_url: string;
    notes_url: string;
}

const VideoPart = () => {
    const { courseName, topicId } = useParams();
    console.log(topicId, "jj");
    const [topic, setTopic] = useState<Topic | null>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopic = async () => {
            if (!topicId) return;
            try {
                const response = await axiosInstance.get(`/course/topics/topic/${topicId}`);
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
                <Link to={`/courses/${topic?.course_id}`} className="font-bold hover:text-blue-500">
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
            <VideoPlayer videoUrl={topic?.video_url as string} courseName={courseName as string} topic={topic as Topic} isDark={isDark} />
        </div>
    );
};

export default VideoPart;

const VideoPlayer = ({ videoUrl, courseName, topic, isDark }: { videoUrl: string; courseName: string; topic: Topic; isDark: boolean }) => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!videoUrl) return;

        const fetchVideo = async () => {
            try {
                const response = await fetch(videoUrl);
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                setVideoSrc(objectUrl);
            } catch (error) {
                console.error("Error fetching video:", error);
            }
        };

        fetchVideo();

        return () => {
            if (videoSrc) {
                URL.revokeObjectURL(videoSrc);
            }
        };
    }, [videoUrl]);

    return (
        <div className="flex justify-center items-center pt-3">
            <div
                className={`w-full max-w-3xl mx-auto border-b rounded shadow-lg 
                    ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
                {videoSrc ? (
                    <div>
                        {/* Video Player */}
                        <video
                            controls
                            controlsList="nodownload"
                            className={`w-full rounded-lg shadow-lg ${isDark ? "bg-gray-900" : "bg-white"}`}
                        >
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Course Info and Notes Link */}
                        <div className="flex w-full sm:max-w-6xl sm:mx-auto justify-between items-center p-2">
                            <h2 className="font-bold">
                                {courseName} | {topic.level} | {topic.title}
                            </h2>
                            <a
                                href={`/courses/${courseName}/topics/notes/${topic._id}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition
                                    ${isDark ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-400 hover:bg-green-600 text-white"}`}
                            >
                                📄 View notes
                            </a>
                        </div>
                    </div>
                ) : (
                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>Loading video...</p>
                )}
            </div>
        </div>
    );
};
