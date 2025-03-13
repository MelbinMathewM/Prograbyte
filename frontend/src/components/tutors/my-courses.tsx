import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { TutorContext } from "../../contexts/tutor-context";
import { fetchCoursesByTutor } from "../../api/course";
import Pagination from "./pagination";
import { useTheme } from "../../contexts/theme-context";

interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    poster_url?: string;
}

const TutorMyCoursesPart = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 1;
    const { tutor } = useContext(TutorContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme.includes("dark");
    const navigate = useNavigate();


    useEffect(() => {
        if (!tutor?.id) return;

        const fetchCourses = async () => {
            try {
                const response = await fetchCoursesByTutor(tutor?.id as string);
                setCourses(response);
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [tutor]);

    // Filter courses based on search
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    return (
        <div className="p-6">
            <nav className={`my-4 p-4 rounded text-sm flex items-center ${isDark ? "text-gray-300 bg-gray-700 shadow-lg" : "text-gray-600 bg-white shadow-lg"}`}>
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <span>Profile</span>
            </nav>

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">My Courses</h1>
                <div className="flex gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-3 py-2 border rounded-lg focus:ring focus:ring-red-400 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    </div>
                    <button onClick={() => navigate(-1)} className="px-4 py-2 flex items-center gap-2 rounded-md font-bold bg-blue-500 text-white hover:bg-blue-600">
                        <ChevronLeft size={16} /> Back
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : currentCourses.length === 0 ? (
                <p className="text-gray-500">No courses found.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentCourses.map(course => (
                            <div
                                key={course._id}
                                className={`p-4 rounded-xl shadow-md ${isDark ? "bg-gray-900 border border-gray-700" : "bg-white"} hover:shadow-lg transition duration-300 relative group`}
                            >
                                {/* Course Thumbnail */}
                                <div className="relative">
                                    <img
                                        src={course.poster_url || "/default-thumbnail.jpg"}
                                        alt={course.title}
                                        className="w-full h-44 object-cover rounded-md"
                                    />
                                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                        ₹{course.price}
                                    </span>
                                </div>

                                {/* Course Details */}
                                <div className="mt-3">
                                    <h2 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h2>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center mt-4">
                                    <Link
                                        to={`/tutor/courses/${course._id}`}
                                        className="text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default TutorMyCoursesPart;
