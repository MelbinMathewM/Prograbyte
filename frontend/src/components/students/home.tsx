import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/theme-context"; // Assuming you have a custom hook for theme

const HomePage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDarkMode = theme === "dark-theme";

    // Dummy Data
    const userCourses = [
        { id: 1, title: "React for Beginners", description: "Learn the basics of React.js." },
        { id: 2, title: "Mastering TypeScript", description: "Deep dive into TypeScript." },
        { id: 3, title: "GraphQL Essentials", description: "Build APIs using GraphQL." }
    ];

    const recommendedCourses = [
        { id: 4, title: "Next.js Advanced Guide", description: "Optimize your Next.js apps." },
        { id: 5, title: "Node.js with Microservices", description: "Learn gRPC and RabbitMQ." },
        { id: 6, title: "DevOps with Kubernetes", description: "Master Kubernetes deployment." }
    ];

    const liveClasses = [
        { id: 7, topic: "Live: Scaling Apps with Kubernetes", date: "March 10", time: "7:00 PM" },
        { id: 8, topic: "Live: GraphQL API Best Practices", date: "March 12", time: "6:30 PM" }
    ];

    const trendingTopics = ["React", "Next.js", "Kubernetes", "gRPC", "GraphQL", "AI/ML"];

    return (
        <div className={`${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} min-h-screen`}>
            {/* Hero Section */}
            <header className={`${isDarkMode ? "bg-blue-400" : "bg-blue-400"} text-white py-16 text-center`}>
                <h1 className="text-4xl font-bold">Welcome Back to Codeon 🚀</h1>
                <p className="mt-3 text-lg">Continue your learning journey with interactive courses, live sessions, and trending topics.</p>
                <button onClick={() => navigate("/explore")} className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
                    Explore New Courses
                </button>
            </header>

            {/* Enrolled Courses Section */}
            <section className="py-12 px-6">
                <h2 className="text-3xl font-semibold text-center">Your Enrolled Courses</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {userCourses.map(course => (
                        <motion.div
                            key={course.id}
                            className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-6 shadow-lg rounded-lg hover:shadow-xl transition cursor-pointer`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate(`/course/${course.id}`)}
                        >
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <p className="mt-2">{course.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recommended Courses Section */}
            <section className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"} py-12 px-6`}>
                <h2 className="text-3xl font-semibold text-center">Recommended for You</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recommendedCourses.map(course => (
                        <motion.div
                            key={course.id}
                            className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"} p-6 shadow-lg rounded-lg hover:shadow-xl transition cursor-pointer`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate(`/course/${course.id}`)}
                        >
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <p className="mt-2">{course.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Live Classes Section */}
            <section className="py-12 px-6">
                <h2 className="text-3xl font-semibold text-center">Upcoming Live Classes</h2>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {liveClasses.map(session => (
                        <motion.div
                            key={session.id}
                            className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-6 shadow-lg rounded-lg hover:shadow-xl transition cursor-pointer`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            onClick={() => navigate(`/live/${session.id}`)}
                        >
                            <h3 className="text-xl font-semibold">{session.topic}</h3>
                            <p className="mt-2">{session.date} - {session.time}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Trending Topics Section */}
            <section className={`${isDarkMode ? "bg-gray-800" : "bg-gray-100"} py-12 px-6`}>
                <h2 className="text-3xl font-semibold text-center">Trending Topics</h2>
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                    {trendingTopics.map(topic => (
                        <button key={topic} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                            {topic}
                        </button>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className={`${isDarkMode ? "bg-gray-900 text-gray-400" : "bg-gray-900 text-gray-300"} py-6 text-center`}>
                <p>&copy; {new Date().getFullYear()} Codeon. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
