import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";
import { useTheme } from "../../contexts/theme-context";

interface Topic {
    _id: string;
    title: string;
    notes_url: string;
}

const ViewNotes = () => {
    const { courseName, topicId } = useParams();
    const [topic, setTopic] = useState<Topic | null>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            if (!topicId) return;
            try {
                const response = await axiosInstance.get(`/course/topics/topic/${topicId}`);
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
            <nav className={`p-6 rounded mb-4 text-sm flex items-center ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-500"}`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronLeft size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">Courses</Link>
                <ChevronLeft size={16} />
                <Link to={`/courses/${courseName}`} className="font-bold hover:text-blue-500">{courseName}</Link>
                <ChevronLeft size={16} />
                <span className="text-gray-300">{topic?.title}</span>
            </nav>

            {/* Title & Back Button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{topic?.title} - Notes</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </button>
            </div>

            {/* Notes Content */}
            <div className={`w-full max-w-4xl mx-auto border rounded-lg shadow-lg ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                {topic?.notes_url ? (
                    <iframe src={topic.notes_url} className="w-full h-[80vh] rounded-lg" title="Notes"></iframe>
                ) : (
                    <p className="text-center py-6 text-gray-500">No notes available for this topic.</p>
                )}
            </div>
        </div>
    );
};

export default ViewNotes;
