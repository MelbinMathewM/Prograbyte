import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IndianRupee, SlidersHorizontal, Star } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Category, Course } from "@/types/course";
import { fetchCategories, fetchCourses } from "@/api/course";
import FilterSidebar from "./course-sidebar";
import Breadcrumb from "./breadcrumb";

const CourseListPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDarkMode = theme === "dark-theme";

    // State Management
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 12;
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Fetch Courses
    useEffect(() => {
        const fetchFilteredCourses = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory !== "All") params.category_id = selectedCategory;
                if (sortOption !== "default") params.sort = sortOption;
                if (minPrice) params.min_price = minPrice;
                if (maxPrice) params.max_price = maxPrice;

                const response = await fetchCourses(params);
                setCourses(response.courses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredCourses();
    }, [searchQuery, selectedCategory, sortOption, minPrice, maxPrice]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await fetchCategories();
                setCategories(response.categories);
            } catch (err: any) {
                console.log(err.response.data.error);
            }
        }
        getCategories();
    }, []);

    // Pagination Logic 
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    return (
        <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} mx-auto px-6 py-6`}>

            {/* Breadcrumb Navigation */}
            <Breadcrumb
                isDark={isDarkMode}
                items={[
                    { label: "Home", to: "/home" },
                    { label: "Courses" },
                ]}
            />

            {/* Hero Section */}
            <header className={`py-16 text-center rounded-sm ${isDarkMode ? "bg-blue-400 text-white" : "bg-blue-400 text-white"}`}>
                <h1 className="text-4xl font-bold">Explore Courses</h1>
                <p className="mt-3 text-lg">Find the best courses to enhance your skills.</p>
            </header>

            {/* Mobile Filter Toggle */}
            <button
                className="md:hidden flex items-center gap-4 w-full bg-blue-500 text-white px-4 py-2 rounded shadow-md mt-2"
                onClick={() => setShowFilters(!showFilters)}
            >
                <SlidersHorizontal size={20} /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="py-4 grid grid-cols-1 md:grid-cols-4 space-y-6 md:gap-6 relative">
                {/* Sidebar - Sticky on larger screens */}
                <div
                    className={`md:block ${showFilters ? "block" : "hidden md:block"} md:sticky top-20 h-fit md:self-start`}
                >
                    <FilterSidebar
                        isDarkMode={isDarkMode}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        minPrice={minPrice as number}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice as number}
                        setMaxPrice={setMaxPrice}
                    />
                </div>

                {/* Course List */}
                <section className="col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentCourses.map((course) => (
                            <motion.div
                                key={course._id}
                                className={`p-3 shadow-lg rounded-sm hover:shadow-xl transition cursor-pointer ${isDarkMode ? "bg-gray-850 text-white border border-gray-700" : "bg-white text-gray-900"}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                onClick={() => navigate(`/courses/${course._id}`)}
                            >
                                <img src={course.poster_url} alt={course.title} className="w-full object-cover rounded-md mb-3" />
                                <h3 className="text-xl font-semibold">{course.title}</h3>
                                <p className="mt-2">Category: {course?.category_id?.name}</p>
                                <p className="flex items-center mt-1 text-green-500">
                                    {course.offer ? (
                                        <>
                                            <span className="flex items-center text-green-500 text-xl font-semibold">
                                                <IndianRupee size={16} />{" "}
                                                {Math.floor((course.price - (course.price * course.offer.discount) / 100))}
                                            </span>
                                            <span className="line-through text-gray-400 ml-1 flex items-center">
                                                <IndianRupee size={16} /> {course.price}
                                            </span>
                                            <span className="ml-2 text-xs text-yellow-600 font-medium">
                                                ({course.offer.discount}% OFF)
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <IndianRupee size={16} className="ml-1" />
                                            {course.price}
                                        </>
                                    )}
                                </p>
                                <p className="flex items-center mt-1 gap-1">Rating: {course.rating ? course.rating : "N/A"} <Star size={16} className="mb-1 text-yellow-500" /></p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button
                            className="px-4 py-2 rounded shadow-md bg-blue-400 text-white hover:bg-blue-500 cursor-pointer"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >Prev</button>
                        <span className="px-4 py-2 shadow-md rounded bg-white text-gray-900">{currentPage} / {totalPages}</span>
                        <button
                            className="px-4 py-2 rounded shadow-md bg-blue-400 text-white hover:bg-blue-500 cursor-pointer"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >Next</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CourseListPage;
