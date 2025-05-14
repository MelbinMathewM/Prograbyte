import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, IndianRupee, Star } from "lucide-react";
import Pagination from "./pagination";
import axiosInstance from "@/configs/axiosConfig";
import { TutorContext } from "@/contexts/tutor-context";
import { useTheme } from "@/contexts/theme-context";
import { Course } from "@/types/course";

const CoursePart = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const coursesPerPage = 4;

    const { tutor } = useContext(TutorContext) || {};
    const { id: tutorId } = tutor || {};
    const { theme } = useTheme();
    const isDarkMode = theme.includes("dark");

    useEffect(() => {
        const fetchMyCourses = async () => {
            if (!tutorId) return;
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/course/courses?tutor_id=${tutorId}`);
                setCourses(response.data.courses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [tutorId]);

    const filteredCourses = courses
        .filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "All" || course.approval_status === statusFilter)
        )
        .sort((a, b) => sortOrder === "asc" ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0));

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

    return (
        <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <nav className="mb-4 text-sm flex items-center">
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <span>My Courses</span>
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <Link to="/tutor/courses/add-course" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    + Add Course
                </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border px-4 py-2 rounded-md w-full ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-900'}`}
                />

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`border px-4 py-2 rounded-md w-full ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-900'}`}
                >
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`border px-4 py-2 rounded-md w-full ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-900'}`}
                >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <p className="text-center">Loading courses...</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedCourses.map((course) => {
                            const isOfferApplied = course.offer;
                            const finalPrice = isOfferApplied
                                ? Math.floor((course.price - (course.price * course.offer.discount) / 100))
                                : course.price;

                            return (
                                <Link
                                    to={`/tutor/courses/${course._id}`}
                                    key={course._id}
                                    className={`rounded-xl overflow-hidden shadow-md transition-transform duration-200 hover:scale-[1.02] cursor-pointer border ${isDarkMode ? "bg-gray-850 border-gray-700" : "bg-white border-gray-300"
                                        }`}
                                >
                                    <img
                                        src={course.poster_url}
                                        alt={course.title}
                                        className="w-full h-40 object-cover"
                                    />

                                    <div className="p-4 space-y-2">
                                        <h3 className={`text-base font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center text-yellow-500 text-sm">
                                            <Star size={16} /> <span className="ml-1">{course.rating || "N/A"}</span>
                                        </div>

                                        {/* Approval Status */}
                                        <span
                                            className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${course.approval_status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : course.approval_status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {course.approval_status}
                                        </span>

                                        {/* Price / Offer */}
                                        <div className="mt-1 font-bold flex items-center gap-2 flex-wrap">
                                            {isOfferApplied ? (
                                                <>
                                                    <span className="text-green-600 text-base flex items-center gap-0">
                                                        <IndianRupee size={16} />
                                                        {finalPrice}
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through flex items-center gap-0">
                                                        <IndianRupee size={14} />
                                                        {course.price}
                                                    </span>
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                                                        {course.offer.discount}% OFF
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-blue-600 text-base flex items-center gap-1">
                                                    <IndianRupee size={16} /> {course.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {filteredCourses.length === 0 && (
                        <p className="text-center mt-4">No courses found.</p>
                    )}

                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default CoursePart;
