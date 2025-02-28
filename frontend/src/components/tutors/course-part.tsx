import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import Pagination from "./pagination";
import axiosInstance from "../../axios/axiosConfig";
import { TutorContext } from "../../contexts/tutor-context";

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
    const coursesPerPage = 4;

    const { tutor } = useContext(TutorContext) || {};
    const { id: tutorId } = tutor || {};

    useEffect(() => {
        const fetchMyCourses = async () => {
            if (!tutorId) return;
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/course/courses?tutor_id=${tutorId}`);
                console.log(response.data)
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [tutorId]);

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

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500 flex items-center">
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <span className="text-gray-700">My Courses</span>
            </nav>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <Link to="/tutor/courses/add-course" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    + Add Course
                </Link>
            </div>

            {/* Search, Sort & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-1/3">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Courses
                    </label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full bg-white"
                    />
                </div>

                <div className="w-full md:w-1/3">
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort by Rating
                    </label>
                    <select
                        id="sort"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full bg-white"
                    >
                        <option value="asc">Low to High</option>
                        <option value="desc">High to Low</option>
                    </select>
                </div>

                <div className="w-full md:w-1/3">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Status
                    </label>
                    <select
                        id="status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-4 py-2 rounded-md w-full bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
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
                                <h3 className="text-lg font-semibold">{course.title}</h3>
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
                                    to={`/tutor/courses/${course._id}`}
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
                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default CoursePart;
