import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "@/configs/axiosConfig";
import { useTheme } from "@/contexts/theme-context";
import PDFViewer from "./notes-pdf";
import { Topic } from "@/types/course";
import Breadcrumb from "./breadcrumb";
import HeaderWithBack from "./header-back";

const ViewNotes = () => {
    const { courseName, topicsId, topicId } = useParams();
    const [topic, setTopic] = useState<Topic | null>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        const fetchNotes = async () => {
            if (!topicId) return;
            try {
                const response = await axiosInstance.get(`/course/topics/${topicsId}/${topicId}`);
                setTopic(response.data);
            } catch (error) {
                console.error("Error fetching notes");
            }
        };
        fetchNotes();
    }, [topicId]);

    return (
        <div className={`${isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"} min-h-screen p-6`}>
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
                title={`Notes - ${topic?.title as string}`}
                isDark={isDark}
            />

            {/* ✅ Notes Content */}
            <div className="mx-auto">
                {topic?.notes_url ? (
                    <PDFViewer notesUrl={topic?.notes_url} isDark={isDark} />
                ) : (
                    <p className="text-center py-10 text-gray-500">No notes available for this topic.</p>
                )}
            </div>
        </div>
    );
};

export default ViewNotes;
