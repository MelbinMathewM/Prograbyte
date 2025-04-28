import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, IndianRupee, Star } from "lucide-react";
import AdminPagination from "./pagination";
import { Course } from "@/types/course";
import { useTheme } from "@/contexts/theme-context";
import NoData from "@/components/ui/no-data";
import { fetchCourses } from "@/api/course";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
                const response = await fetchCourses({ category_id: categoryId });
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
        <div className={`p-6 min-h-screen ${isDark ? "bg-black/99 text-gray-200" : "bg-white text-gray-900"}`}>
            <nav className="mb-4 text-sm flex items-center">
                <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
                <ChevronRight size={16} />
                <Link to="/admin/categories" className="hover:text-blue-400">Categories</Link>
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
                <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`border ${isDark ? "border-gray-400" : "border-gray-400"}`}
                />
                <Select onValueChange={(value) => setSortOrder(value)} defaultValue="price-low">
                    <SelectTrigger className={isDark ? "bg-gray-850 text-white" : "bg-white text-gray-900"}>
                        <SelectValue placeholder="Sort by price" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-black text-white" : "bg-white text-gray-900"}>
                        <SelectItem value="price-low">Low to High</SelectItem>
                        <SelectItem value="price-high">High to Low</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="All">
                    <SelectTrigger className={isDark ? "bg-gray-850 text-white" : "bg-white text-gray-900"}>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? "bg-black text-white" : "bg-white text-gray-900"}>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
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
                            <Link
                                to={`/admin/categories/courses/${course._id}`}
                                key={course._id}
                                className={`block shadow-md border rounded-sm overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg duration-300
      ${isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
                            >
                                <img
                                    src={course.poster_url}
                                    alt={course.title}
                                    className="w-full p-3 rounded-sm h-40 object-cover"
                                />

                                <div className="p-4 space-y-2">
                                    <h3 className="text-lg font-semibold">{course.title}</h3>

                                    {/* Price Section */}
                                    {course.offer ? (
                                        <div className="flex items-center gap-x-2 text-sm">
                                            <span className="text-green-600 font-bold flex items-center gap-0">
                                                <IndianRupee size={14} />
                                                {Math.floor(course.price - (course.price * course.offer.discount) / 100)}
                                            </span>
                                            <span className="text-gray-500 line-through flex items-center gap-0">
                                                <IndianRupee size={12} />
                                                {course.price}
                                            </span>
                                            <span className="text-yellow-700 text-xs font-semibold">
                                                ({course.offer.discount}% OFF)
                                            </span>
                                        </div>
                                    ) : (
                                        <h4 className="text-sm opacity-80 flex items-center gap-0">
                                            <IndianRupee size={14} /> {course.price}
                                        </h4>
                                    )}

                                    <div className="flex items-center text-yellow-400 text-sm">
                                        <Star size={16} /> <span className="ml-1">{course.rating || "N/A"}</span>
                                    </div>

                                    <p className={`inline-block text-xs font-semibold rounded-md px-2 py-1
        ${course.approval_status === "Approved" ? "text-green-500 bg-green-100 dark:bg-green-900" :
                                            course.approval_status === "Pending" ? "text-yellow-500 bg-yellow-100 dark:bg-yellow-900" :
                                                "text-red-500 bg-red-100 dark:bg-red-900"}`}>
                                        {course.approval_status}
                                    </p>
                                </div>
                            </Link>
                        ))}

                    </div>
                    <AdminPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default CoursePart;
