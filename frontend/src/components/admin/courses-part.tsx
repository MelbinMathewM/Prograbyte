import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../axios/axiosConfig";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import AdminPagination from "./pagination";

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

const CoursePart = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const coursesPerPage = 4;
    
    const { categoryName, categoryId } = useParams();

    useEffect(() => {
        const fetchCourses = async () => {
            if (!categoryId) return;
            try {
                const response = await axiosInstance.get(`course/courses?category_id=${categoryId}`);
                console.log(response.data)
                setCourses(response.data);
            } catch (error: any) {
                if (error.response) {
                    setError(error.response.data.error || "Failed to update category");
                } else if (error.request) {
                    setError("No response from server. Please try again.");
                } else {
                    setError("An unexpected error occurred. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [categoryName]);

    // Filter, Search, and Sort Logic
    const filteredCourses = courses
        .filter(course =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "All" || course.approval_status === statusFilter)
        )
        .sort((a, b) => sortOrder === "asc" ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0));

    // Pagination Logic
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

    {error && <div>
        <h3>{error}</h3>
    </div>
    }
    if (courses.length === 0) return <p>No courses found for {categoryName}.</p>;

    return (
        <div className="p-6">
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
                <h2 className="text-2xl font-bold">{categoryName}</h2>
                <Link to="/admin/categories" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <ChevronLeft className="mt-1" size={18} />
                    Back
                </Link>
            </div>

            {/* Search, Sort & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-1/3">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-200 mb-1">
                        Search Courses
                    </label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full"
                    />
                </div>

                <div className="w-full md:w-1/3">
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-200 mb-1">
                        Sort by Rating
                    </label>
                    <select
                        id="sort"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full"
                    >
                        <option className="text-black" value="asc">Low to High</option>
                        <option className="text-black" value="desc">High to Low</option>
                    </select>
                </div>

                <div className="w-full md:w-1/3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-200 mb-1">
                        Filter by Status
                    </label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full"
                    >
                        <option className="text-black" value="All">All Status</option>
                        <option className="text-black" value="Approved">Approved</option>
                        <option className="text-black" value="Pending">Pending</option>
                        <option className="text-black" value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <p className="text-center text-gray-600">Loading courses...</p>
            ) : (
                <>
                    {/* Course List */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedCourses.map(course => (
                            <div key={course._id} className="bg-white shadow-md rounded-lg p-3">
                                <img src={course.poster_url} alt={course.title} className="w-full object-cover rounded-md mb-3" />
                                <h3 className="text-lg text-black font-semibold">{course.title}</h3>
                                <h4 className="text-black">₹{course.price}</h4>
                                <div className="flex items-center text-yellow-500 my-1">
                                    <Star size={16} /> <span className="ml-1">{course.rating || "N/A"}</span>
                                </div>
                                <p className={`px-2 py-1 text-sm font-semibold rounded-md ${
                                    course.approval_status === "Approved" ? "bg-green-100 text-green-600" :
                                    course.approval_status === "Pending" ? "bg-yellow-100 text-yellow-600" :
                                    "bg-red-100 text-red-600"
                                }`}>
                                    {course.approval_status}
                                </p>
                                <Link
                                    to={`/admin/categories/courses/${course._id}`}
                                    className="inline-block w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-2"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* No Courses Found */}
                    {filteredCourses.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No courses found.</p>
                    )}

                    {/* Pagination */}
                    <AdminPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default CoursePart;

