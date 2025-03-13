import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, PlayCircle, ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import { UserContext } from "../../contexts/user-context";
import { getEnrolledCourses } from "../../api/profile";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export interface Course {
    _id: string;
    title: string;
    description: string;
    category_id: string;
    tutor_id: string;
    price: number;
    preview_video_url: string;
    poster_url: string;
    approval_status: ApprovalStatus;
    rating: number | null;
    createdAt?: string;
    updatedAt?: string;
}

interface EnrolledCourse {
    courseId: Course;
    paymentAmount: number;
}

interface EnrolledCourses {
    _id: string;
    userId: string;
    courses: EnrolledCourse[];
}

const MyCoursesPart = () => {
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourses | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 8; // Number of courses per page

    const { theme } = useTheme();
    const isDark = theme.includes("dark");
    const { user } = useContext(UserContext) ?? {};
    const navigate = useNavigate();

    const [userData, setUserData] = useState<{ id?: string; email?: string; name?: string }>({});
    
        useEffect(() => {
            if (user) {
                setUserData({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                });
            }
        }, [user]);

    useEffect(() => {
        if (!userData?.id) return;
        const fetchEnrollCourses = async () => {
            try {
                const response = await getEnrolledCourses(userData.id as string);
                setEnrolledCourses(response.enrolledCourses);
            } catch (err: any) {
                console.error(err.response?.data?.error || "Error fetching courses");
            }
        };
        fetchEnrollCourses();
    }, [userData]);

    // Filtering courses based on search
    const filteredCourses = enrolledCourses?.courses?.filter(
        (course) => course.courseId?.title?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    // Pagination Logic
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-[#414040]"}`}>
            {/* Breadcrumb Navigation */}
            <nav className={`p-6 rounded mb-4 flex items-center ${isDark ? "bg-gray-700 text-white" : "bg-[#ffffff] text-gray-600"}`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <span>My Courses</span>
            </nav>

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-md ${isDark ? "border border-gray-800 hover:border-gray-600" : "bg-white shadow-sm"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {enrolledCourses === null ? (
                    // Skeleton Loader while fetching data
                    Array(8).fill(0).map((_, index) => (
                        <div key={index} className={`shadow-md rounded-lg p-4 ${isDark ? "bg-gray-800" : "bg-[#ffffff]"}`}>
                            <Skeleton height={160} className="rounded-md mb-3" />
                            <Skeleton height={20} width="80%" />
                            <Skeleton height={16} width="60%" className="mt-2" />
                            <div className="flex justify-between items-center mt-3">
                                <Skeleton height={16} width="40%" />
                                <Skeleton height={32} width={90} />
                            </div>
                        </div>
                    ))
                ) : paginatedCourses.length > 0 ? (
                    // Render Courses
                    paginatedCourses.map((course) => (
                        <div key={course.courseId._id} className={`shadow-md rounded-lg p-4 transition-transform transform hover:scale-105 ${isDark ? "bg-gray-800 text-white" : "bg-[#ffffff] text-gray-700"}`}>
                            <img
                                src={course.courseId.poster_url || "/default-thumbnail.jpg"}
                                alt={course.courseId.title}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <h3 className="text-lg font-semibold">{course.courseId.title}</h3>
                            <p className="text-sm text-gray-500">Instructor: {course.courseId.tutor_id || "Unknown"}</p>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm font-medium text-green-500">Paid: ${course.paymentAmount}</span>
                                <Link to={`/courses/${course.courseId._id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-2 hover:bg-blue-600">
                                    <PlayCircle size={16} /> Continue
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    // No courses found
                    <div className="m-auto">
                        <p className="text-center text-gray-500">No enrolled courses found.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={`px-4 py-2 rounded-md font-bold transition ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
                    >
                        Previous
                    </button>
                    <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={`px-4 py-2 rounded-md font-bold transition ${isDark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyCoursesPart;
