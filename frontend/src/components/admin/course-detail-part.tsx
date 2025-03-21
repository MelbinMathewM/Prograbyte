import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import axiosInstance from "../../axios/axiosConfig";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Topic, Course, ApprovalStatus } from "../../types/course";


const CourseDetailPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [topics, setTopics] = useState<Topic[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axiosInstance.get(`course/courses/${courseId}`);
                setCourse(response.data);
            } catch (error: any) {
                if (error.response) {
                    setError(error.response.data.error || "Failed to fetch course details");
                } else if (error.request) {
                    setError("No response from server. Please try again.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
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
                const response = await axiosInstance.get(`/course/topics/${courseId}`);
                setTopics(response.data);
            } catch (error: any) {
                if (error.response) {
                    setError(error.response.data.error || "Failed to fetch topics");
                } else if (error.request) {
                    setError("No response from server. Please try again.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            }
        };

        fetchTopics();
    }, [courseId]);

    const handleApprovalToggle = async () => {
        if (!course) return;
    
        let newStatus: ApprovalStatus;
    
        if (course.approval_status === "Pending") {
            newStatus = "Approved";
        } else if (course.approval_status === "Approved") {
            newStatus = "Rejected";
        } else {
            newStatus = "Approved";
        }
    
        try {
            const response = await axiosInstance.patch(`course/courses/${courseId}/status`, {
                status: newStatus,
            });
    
            if (response.status === 200) {
                setCourse((prevCourse) => prevCourse ? { ...prevCourse, approval_status: newStatus } : null);
            }
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.error || "Failed to fetch topics");
            } else if (error.request) {
                setError("No response from server. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };
    

    if (loading) return <p className="text-gray-300 text-center">Loading...</p>;
    if (!course) return <p className="text-red-500 text-center">Course not found.</p>;

    return (
        <div className="p-6 rounded-lg shadow-md bg-gray-900 text-white min-h-screen">

            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-400 flex items-center">
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <Link to="/tutor/categories" className="hover:text-blue-500">Categories</Link>
                <ChevronRight size={16} />
                <span className="text-gray-400">Courses</span>
            </nav>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{course.title}</h2>
                <Link to="/admin/categories" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <ChevronLeft className="mt-1" size={18} />
                    Back
                </Link>
            </div>

            <p>{course.description}</p>
            <p className={`font-semibold ${course.approval_status === "Approved" ? "text-green-400" : course.approval_status === "Rejected" ? "text-red-400" : "text-yellow-400"}`}>
                Status: {course.approval_status.toUpperCase()}
            </p>
            <h4>₹{course.price}</h4>

            {/* Approve/Reject Button */}
            <Button
                className="mt-4"
                onClick={handleApprovalToggle}
                variant={course.approval_status === "Pending" ? "success" : "destructive"}
            >
                {course.approval_status === "Approved" ? "Reject" : "Approve"}
            </Button>

            {/* Delete Course Button */}
            <Button
                className="mt-4 ml-4 bg-gray-700 hover:bg-gray-800 text-white"
                // onClick={handleDeleteCourse}
            >
                Delete Course
            </Button>


            {course.preview_video_urls && course.poster_url && (
                <div className="mb-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Poster Image</h3>
                        <img src={course.poster_url} alt="poster" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Preview Video</h3>
                        <video className="w-full rounded-lg" controls>
                            <source src={course.preview_video_urls[0]} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}

            <h2 className="mt-6 text-2xl font-semibold text-gray-200">Topics:</h2>
            <ul className="mt-4 space-y-4">
                {topics && topics.length > 0 ? (
                    topics.map((topic) => (
                        <li key={topic._id} className="p-4 rounded-md bg-gray-800 shadow-md">
                            <h3 className="text-lg font-medium text-blue-300">{topic.title}</h3>
                            <p className="text-gray-400">Level: {topic.level}</p>
                            <div className="mt-2 space-x-4">
                                <a href={topic.video_url} className="text-blue-400 hover:underline">
                                    🎥 Watch Video
                                </a>
                                <a href={topic.notes_url} className="text-blue-400 hover:underline">
                                    📄 View Notes
                                </a>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-400">No topics available.</p>
                )}
            </ul>
        </div>
    );
};

export default CourseDetailPage;
