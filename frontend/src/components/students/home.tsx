import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { ArrowRight, Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { fetchCourses, fetchEnrolledCourse } from "@/api/course";
import { UserContext } from "@/contexts/user-context";
import { Course } from "@/types/course";

const HomePage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkMode = theme === "dark-theme";

    const { user } = useContext(UserContext) ?? {};
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);

    useEffect(() => {
        if (!user) return;

        const getCourses = async () => {
            try {
                const response = await fetchEnrolledCourse(user.id);
                const enrolledCourses = response.enrolledCourses.courses;

                const enrolledCourseIds = new Set(
                    enrolledCourses.map((item: any) => item.courseId._id || item.courseId)
                );

                const enrolled = response.enrolledCourses.courses.slice(0, 3);

                const courses = enrolled.map((item: any) => item.courseId);
                setUserCourses(courses);

                const allCourses = await fetchCourses();

                const recommended = allCourses.courses.filter(
                    (course: any) => !enrolledCourseIds.has(course._id)
                );

                const topRecommended = recommended.slice(0, 3);

                setRecommendedCourses(topRecommended);
            } catch (err) {
                console.error("Error fetching enrolled courses:", err);
            }
        };

        getCourses();
    }, [user]);

    return (
        <div className={`${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} min-h-screen p-2 sm:p-6`}>
            {/* Hero Section */}
            <header className={`${isDarkMode ? "bg-blue-400" : "bg-blue-400"} text-white py-10 text-center`}>
                <h1 className="text-2xl font-bold">Welcome to <span className="italic text-3xl">Prograbyte</span></h1>
                <p className="mt-3">Continue your learning journey with interactive courses, live sessions, and trending topics.</p>
                <button onClick={() => navigate("/courses")} className="mt-6 px-6 py-3 bg-blue-400 border border-white text-white font-semibold rounded-lg shadow-md hover:bg-white hover:text-blue-400 transition">
                    Explore Courses
                </button>
            </header>

            {/* Enrolled Courses Section */}
            <section className="py-12 px-6">
                <h2 className="text-2xl font-semibold">Your courses</h2>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {userCourses.map(course => (
                        <motion.div
                            key={course._id}
                            className={`border ${isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"} p-2 shadow-lg rounded-md hover:shadow-xl transition cursor-pointer`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate(`/course/${course._id}`)}
                        >
                            {/* Course Image */}
                            <img
                                src={course.poster_url}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />

                            {/* Course Title */}
                            <h3 className="text-lg font-bold mb-2 truncate">{course.title}</h3>

                            {/* Category or Placeholder */}
                            <p className="flex gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Star color="yellow" size={16} />{course.rating || "N/A"}
                            </p>
                        </motion.div>
                    ))}

                </div>

                {/* See More Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => navigate("/profile/my-courses")}
                        className="px-6 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
                    >
                        More <ArrowRight />
                    </button>
                </div>
            </section>


            {/* Recommended Courses Section */}
            <section className={`${isDarkMode ? "bg-black/35" : "bg-gray-100"} py-12 px-6`}>
                <h2 className="text-2xl font-semibold">Recommended</h2>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {recommendedCourses.map(course => (
                        <motion.div
                            key={course._id}
                            className={`border ${isDarkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"} p-2 shadow-lg rounded-md hover:shadow-xl transition cursor-pointer`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate(`/course/${course._id}`)}
                        >
                            {/* Course Image */}
                            <img
                                src={course.poster_url}
                                alt={course.title}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />

                            {/* Course Title */}
                            <h3 className="text-lg font-bold mb-2 truncate">{course.title}</h3>

                            {/* Category or Placeholder */}
                            <p className="flex gap-1 text-sm text-gray-500 dark:text-gray-400">
                                <Star color="yellow" size={16} />{course.rating || "N/A"}
                            </p>
                        </motion.div>
                    ))}
                </div>
                {/* See More Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => navigate("/courses")}
                        className="px-6 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition"
                    >
                        More <ArrowRight />
                    </button>
                </div>
            </section>

            <section className={`py-12 px-6`}>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Stay Updated with Fresh Content</h2>
                    <p className="mb-6 text-gray-500 dark:text-gray-300">
                        Explore our latest blogs to keep up with industry trends, developer tips, and coding best practices.
                    </p>
                    <button
                        onClick={() => navigate("/blog")}
                        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
                    >
                        Visit Blogs
                    </button>
                </div>
            </section>

        </div>
    );
};

export default HomePage;
