import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/configs/axiosConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Topic, Course, ApprovalStatus, Topics } from "@/types/course";
import { useTheme } from "@/contexts/theme-context";
import { fetchCourseDetail, fetchTopicsByCourse } from "@/api/course";

const CourseDetailPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [mainTopic, setMainTopic] = useState<Topics | null>(null);
    const [topics, setTopics] = useState<Topic[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useTheme();
    const isDark = theme.includes("dark");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetchCourseDetail(courseId as string);
                setCourse(response.course);
            } catch (error: any) {
                setError(error?.error || "Failed to fetch course details");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    useEffect(() => {
        const fetchTopics = async () => {
            if (!courseId) return;
            try {
                const response = await fetchTopicsByCourse(courseId);
                setMainTopic(response.topicList);
                setTopics(response.topicList.topics);
            } catch (error: any) {
                console.error(error?.error || "Failed to fetch topics");
            }
        };
        fetchTopics();
    }, [courseId]);

    const handleApprovalToggle = async () => {
        if (!course) return;
        let newStatus: ApprovalStatus = course.approval_status === "Pending" ? "Approved" : course.approval_status === "Approved" ? "Rejected" : "Approved";
        try {
            const response = await axiosInstance.patch(`course/courses/${courseId}/status`, { status: newStatus });
            if (response.status === 200) {
                setCourse((prev) => (prev ? { ...prev, approval_status: newStatus } : null));
            }
        } catch (error: any) {
            console.error(error.response?.data.error || "Failed to update status");
        }
    };

    if (loading) return <p className="text-gray-400 text-center text-lg animate-pulse">Loading...</p>;
    if(error) return <p>{error}</p>
    if (!course) return <p className="text-red-500 text-center text-lg">Course not found.</p>;

    return (
        <div className={`p-8 shadow-lg ${isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"}`}>
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 text-sm flex items-center gap-2">
                <Link to="/tutor/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                <ChevronRight size={16} />
                <Link to="/tutor/categories" className="hover:text-blue-400 transition">Categories</Link>
                <ChevronRight size={16} />
                <span className="text-gray-400">Courses</span>
            </nav>

            {/* Course Title and Back Button */}
            <div className="flex justify-between items-center mb-6 border-gray-700 pb-4">
                <h2 className="text-3xl font-bold text-blue-500">{course.title}</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-blue-400 hover:bg-blue-500 hover:text-white" : "text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>

            {/* Course Description & Status */}
            <p className="text-lg opacity-80">{course.description}</p>
            <p className={`font-semibold mt-2 ${course.approval_status === "Approved" ? "text-green-400" : course.approval_status === "Rejected" ? "text-red-400" : "text-yellow-400"}`}>
                Status: {course?.approval_status?.toUpperCase()}
            </p>
            <h4 className="text-xl font-semibold mt-2">₹{course.price}</h4>

            {/* Approval and Delete Buttons */}
            <div className="mt-6 flex gap-4">
                <Button onClick={handleApprovalToggle} variant={course.approval_status === "Pending" ? "success" : "destructive"}>
                    {course.approval_status === "Approved" ? "Reject" : "Approve"}
                </Button>
                <Button className="bg-gray-700 hover:bg-gray-800">Delete Course</Button>
            </div>

            {/* Course Media (Poster & Video) */}
            {course.preview_video_urls && course.poster_url && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Poster Image */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Poster Image</h3>
                          <img
                            src={course.poster_url}
                            alt="Course Poster"
                            className="rounded-lg shadow-md"
                          />
                        </div>
            
                        {/* Preview Video */}
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Preview Video</h3>
                          <video className="w-full rounded-lg shadow-md" controls>
                            <source src={course.preview_video_urls?.[0]} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                  )}


            {/* Topics Section */}
            <h2 className="mt-8 text-2xl font-semibold">Topics:</h2>
            <ul className="mt-4 space-y-4">
                {topics && topics.length > 0 ? (
                    topics.map((topic) => (
                        <li key={topic._id} className="p-4 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700 transition transform hover:scale-[1.02]">
                            <h3 className="text-lg font-medium text-blue-300">{topic.title}</h3>
                            <p className="text-gray-400">Level: {topic.level}</p>
                            <div className="mt-2 space-x-4">
                                <a href={`/admin/categories/courses/${course.title}/topics/${mainTopic?._id}/video/${topic._id}`} className="text-blue-400 hover:underline">🎥 Watch Video</a>
                                <a href={topic.notes_url} className="text-blue-400 hover:underline">📄 View Notes</a>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-400 text-center">No topics available.</p>
                )}
            </ul>
        </div>
    );
};

export default CourseDetailPage;
