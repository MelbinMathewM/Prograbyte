import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight, PlayCircle, ChevronLeft } from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import Skeleton from "react-loading-skeleton";
import Progress from "@/components/ui/progress";
import { UserContext } from "../../contexts/user-context";
import { getEnrolledCourses } from "../../api/profile";
import "react-loading-skeleton/dist/skeleton.css";
import { EnrolledCourses } from "../../types/course";
import axiosInstance from "@/configs/axiosConfig";
import CourseRatingModal from "./course-rating-modal";

const MyCoursesPart = () => {
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourses | null>(null);
    const [tutorDetails, setTutorDetails] = useState<{ [key: string]: { name: string; username: string } }>({});
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 12;
    const [loadingTutors, setLoadingTutors] = useState(false);

    const { theme } = useTheme();
    const isDark = theme.includes("dark");
    const { user } = useContext(UserContext) ?? {};
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.id) return;
        const fetchEnrollCourses = async () => {
            try {
                const response = await getEnrolledCourses(user.id);
                setEnrolledCourses(response.enrolledCourses);
            } catch (err: any) {
                console.error(err.response?.data?.error || "Error fetching courses");
            }
        };
        fetchEnrollCourses();
    }, [user]);

    useEffect(() => {
        const fetchTutorDetails = async () => {
            if (!enrolledCourses) return;
            setLoadingTutors(true);
            const uniqueTutorIds = Array.from(new Set(enrolledCourses.courses.map(course => course.courseId.tutor_id)));
            const tutorData: { [key: string]: { name: string; username: string } } = {};
            try {
                await Promise.all(uniqueTutorIds.map(async (tutorId) => {
                    if (tutorId && !tutorDetails[tutorId]) {
                        const res = await axiosInstance.get(`/user/user/${tutorId}`);
                        tutorData[tutorId] = {
                            name: res.data.user.name,
                            username: res.data.user.username
                        };
                    }
                }));
                setTutorDetails(prev => ({ ...prev, ...tutorData }));
            } catch (error) {
                console.error("Error fetching tutor details", error);
            }
            setLoadingTutors(false);
        };
        fetchTutorDetails();
    }, [enrolledCourses]);

    const filteredCourses = enrolledCourses?.courses?.filter(
        (course) => course.courseId?.title?.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-[#414040]"}`}>
            <nav className={`p-6 rounded mb-4 flex items-center ${isDark ? "bg-gray-700 text-white" : "bg-[#ffffff] text-gray-600"}`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <span>My Courses</span>
            </nav>

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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {loadingTutors ? (
                    <Skeleton height={200} count={4} />
                ) : paginatedCourses.length > 0 ? (
                    paginatedCourses.map((course) => (
                        <div key={course.courseId._id} className={`shadow-md rounded-lg p-4 transition-transform transform hover:scale-105 ${isDark ? "bg-gray-800 text-white" : "bg-[#ffffff] text-gray-700"}`}>
                            <img
                                src={course.courseId.poster_url || "/default-thumbnail.jpg"}
                                alt={course.courseId.title}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <h3 className="text-lg font-semibold">{course.courseId.title}</h3>
                            <p className="text-sm text-gray-500">Instructor: {tutorDetails[course.courseId.tutor_id]?.name || "Loading..."}</p>
                            <Progress value={course.completionStatus || 0} isDark={isDark} />
                            <span className="text-xs text-gray-500">{course.completionStatus}% completed</span>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm font-medium text-green-500">Paid: ${course.paymentAmount}</span>
                                {course.completionStatus === 100 && (
                                    <div>
                                        <CourseRatingModal courseId={course.courseId._id} isDark={isDark} userId={user?.id as string}/>
                                    </div>
                                )}
                                <Link to={`/courses/${course.courseId._id}`} className="bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-2 hover:bg-blue-600">
                                    <PlayCircle size={16} /> Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No enrolled courses found.</p>
                )}
            </div>


            <div className="flex justify-center items-center mt-6 gap-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50">Prev</button>
                <span>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50">Next</button>
            </div>
        </div>
    );
};

export default MyCoursesPart;
