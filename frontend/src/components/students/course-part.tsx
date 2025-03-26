import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import axiosInstance from "../../configs/axiosConfig";
import { useTheme } from "../../contexts/theme-context";
import { Course } from "../../types/course";

const CourseListPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDarkMode = theme === "dark-theme";

    // Fetch Courses
    useEffect(() => {
        const fetchMyCourses = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/course/courses`);
                setCourses(response.data);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, []);

    // State Management
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 3;

    // Filtered & Sorted Courses
    const filteredCourses = courses
        .filter(
            (course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (selectedCategory === "All" || course.category_id.name === selectedCategory)
        )
        .sort((a, b) => {
            if (sortOption === "price-low") return a.price - b.price;
            if (sortOption === "price-high") return b.price - a.price;
            return 0;
        });

    // Pagination Logic
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    return (
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 flex items-center p-5">
                <Link to="/home" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <span className={`${isDarkMode ? "text-gray-400" : "text-gray-800"} dark:text-gray-300`}>Courses</span>
            </nav>

            {/* Hero Section */}
            <header className={`py-16 text-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-blue-400 text-white"}`}>
                <h1 className="text-4xl font-bold">Explore Courses 🚀</h1>
                <p className="mt-3 text-lg">Find the best courses to enhance your skills.</p>
            </header>

            {/* Filters & Search */}
            <div className="py-6 px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div className={`relative rounded shadow-md flex items-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className={`p-2 rounded w-full pr-10 ${isDarkMode ? "bg-gray-800 text-white placeholder-gray-400" : "bg-white text-gray-900"}`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="absolute right-3">
                        <Search size={20} />
                    </button>
                </div>

                {/* Category Filter */}
                <select
                    className={`p-2 shadow-md rounded w-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Programming">Programming</option>
                    <option value="Data Science">Data Science</option>
                </select>

                {/* Sorting Option */}
                <select
                    className={`p-2 shadow-md rounded w-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"}`}
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="default">Sort By</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {/* Course List */}
            <section className="py-8 px-6">
                <h2 className="text-3xl font-semibold text-center">Available Courses</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {currentCourses.map((course) => (
                        <motion.div
                            key={course._id}
                            className={`p-3 shadow-lg rounded-lg hover:shadow-xl transition cursor-pointer ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                                }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate(`/courses/${course._id}`)}
                        >
                            <img src={course.poster_url} alt={course.title} className="w-full object-cover rounded-md mb-3" />
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <p className="mt-2">Instructor: {course.tutor_id}</p>
                            <p className="mt-1">Price: ${course.price}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                    className={`px-4 py-2 rounded shadow-md 
            ${currentPage === 1
                            ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                            : `${isDarkMode ? "bg-gray-800 text-white" : "bg-blue-400 text-white hover:bg-blue-500"}`}`}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <span className={`px-4 py-2 shadow-md rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                    {currentPage} / {totalPages}
                </span>

                <button
                    className={`px-4 py-2 shadow-md rounded 
            ${currentPage === totalPages
                            ? `${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`
                            : `${isDarkMode ? "bg-gray-800 text-white" : "bg-blue-400 text-white hover:bg-blue-500"}`}`}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

        </div>
    );
};

export default CourseListPage;
