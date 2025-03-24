import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";
import { useTheme } from "../../contexts/theme-context";
import PDFViewer from "./notes-pdf";
import { Topic } from "../../types/course";

const ViewNotes = () => {
    const { courseName, topicsId, topicId } = useParams();
    const [topic, setTopic] = useState<Topic | null>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const navigate = useNavigate();

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
            {/* ✅ Breadcrumb Navigation */}
            <nav className={`p-4 md:p-6 rounded mb-8 text-sm flex flex-wrap items-center gap-2 ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"}`}>
                <Link to="/home" className="font-semibold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-semibold hover:text-blue-500">Courses</Link>
                <ChevronRight size={16} />
                <Link to={`/courses/${courseName}`} className="font-semibold hover:text-blue-500 capitalize">{courseName}</Link>
                <ChevronRight size={16} />
                <span className="text-gray-400">{topic?.title}</span>
            </nav>

            {/* ✅ Title & Back Button */}
            <div className="flex w-full sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Notes - {topic?.title}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>

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
