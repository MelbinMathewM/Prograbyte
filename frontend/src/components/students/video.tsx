import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "@/configs/axiosConfig";
import { useTheme } from "@/contexts/theme-context";
import VideoPlayer from "./video-player";
import { Topic } from "@/types/course";
import { UserContext } from "@/contexts/user-context";
import Breadcrumb from "./breadcrumb";
import HeaderWithBack from "./header-back";

const VideoPart = () => {
    const { courseName, topicId, topicsId } = useParams();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get("courseId");
    const [topic, setTopic] = useState<Topic | null>(null);
    const { user } = useContext(UserContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

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
            <Breadcrumb 
                isDark={isDark}
                items={[
                    {label: "Home", to: "/home"},
                    { label: "Courses", to: "/courses" },
                    { label: `${courseName}`, to: `/courses/${topicsId}` },
                    { label: `${topic?.title}` }
                ]}
            />

            {/* Title and Back Button */}
            <HeaderWithBack 
                title={topic?.title as string}
                isDark={isDark}
            />

            {/* Video Player Component */}
            <VideoPlayer publicId={topic?.video_url as string} isDark={isDark} userId={user?.id as string} courseId={courseId as string} topicId={topic?._id as string} />
        </div>
    );
};

export default VideoPart;