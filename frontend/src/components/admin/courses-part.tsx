import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import AdminPagination from "./pagination";
import { Course } from "@/types/course";
import { useTheme } from "@/contexts/theme-context";
import NoData from "@/components/ui/no-data";
import { fetchCourses } from "@/api/course";

const CoursePart = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const coursesPerPage = 4;
    const { theme } = useTheme();
    const isDark = theme.includes("dark");
    
    const { categoryName, categoryId } = useParams();

    useEffect(() => {
        const getCourses = async () => {
            if (!categoryId) return;
            setLoading(true);
            try {
                const response = await fetchCourses({category_id: categoryId});
                setCourses(response.courses);
            } catch (error: any) {
                setError(error?.error || "Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };
        getCourses();
    }, [categoryId]);

    const filteredCourses = courses
        .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(course => statusFilter === "All" || course.approval_status === statusFilter)
        .sort((a, b) => sortOrder === "price-low" ? a.price - b.price : b.price - a.price);

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

    return (
        <div className={`p-6 min-h-screen ${isDark ? "bg-gray-900 text-gray-200" : "bg-white text-gray-900"}`}>
            <nav className="mb-4 text-sm flex items-center">
                <Link to="/tutor/dashboard" className="hover:text-blue-400">Dashboard</Link>
                <ChevronRight size={16} />
                <Link to="/tutor/categories" className="hover:text-blue-400">Categories</Link>
                <ChevronRight size={16} />
                <span className="opacity-75">Courses</span>
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{categoryName}</h2>
                <Link to="/admin/categories" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <ChevronLeft className="mt-1" size={18} /> Back
                </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border px-4 py-1 rounded-md w-full ${isDark ? "bg-gray-850 text-white border-gray-600" : "bg-gray-100 text-gray-900"}`}
                />
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`border px-4 py-2 rounded-md w-full ${isDark ? "bg-gray-850 text-white border-gray-600" : "bg-gray-100 text-gray-900"}`}
                >
                    <option value="price-low">Low to High</option>
                    <option value="price-high">High to Low</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`border px-4 py-2 rounded-md w-full ${isDark ? "bg-gray-850 text-white border-gray-600" : "bg-gray-100 text-gray-900"}`}
                >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <p className="text-center">Loading courses...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : paginatedCourses.length === 0 ? (
                <NoData entity="courses" />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedCourses.map(course => (
                            <div key={course._id} className={`shadow-md border rounded-sm transition-transform transform hover:scale-105 p-3 ${isDark ? "bg-gray-850 border-gray-700" : "bg-white border-gray-200"}`}>
                                <img src={course.poster_url} alt={course.title} className="w-full object-cover rounded-md mb-3" />
                                <h3 className="text-lg font-semibold">{course.title}</h3>
                                <h4 className="opacity-75">₹{course.price}</h4>
                                <div className="flex items-center text-yellow-400 my-1">
                                    <Star size={16} /> <span className="ml-1">{course.rating || "N/A"}</span>
                                </div>
                                <p className={`px-2 text-sm font-semibold rounded-md ${
                                    course.approval_status === "Approved" ? "text-green-600" :
                                    course.approval_status === "Pending" ? "text-yellow-600" :
                                    "text-red-600"
                                }`}>
                                    {course.approval_status}
                                </p>
                                <Link
                                    to={`/admin/categories/courses/${course._id}`}
                                    className="inline-block text-blue-500 font-semibold px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white hover:font-normal mt-1"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                    <AdminPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default CoursePart;
