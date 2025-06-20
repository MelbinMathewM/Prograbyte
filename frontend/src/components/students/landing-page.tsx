import { FaPlay, FaCheckCircle, FaChalkboardTeacher, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        title: "Expert Instructors",
        desc: "Learn from top professionals with real-world experience.",
        icon: <FaChalkboardTeacher className="text-blue-500 text-3xl" />,
    },
    {
        title: "Live Streaming Classes",
        desc: "Join interactive sessions and clear doubts instantly.",
        icon: <FaPlay className="text-pink-500 text-3xl" />,
    },
    {
        title: "Recognized Certification",
        desc: "Earn certificates valued by employers.",
        icon: <FaCheckCircle className="text-green-500 text-3xl" />,
    },
    {
        title: "Tech Blogs & Community",
        desc: "Engage with tech content and a global dev community.",
        icon: <FaClock className="text-yellow-500 text-3xl" />,
    },
];

const LandingPagePart = () => {
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const bg = isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900";
    const cardBg = isDark ? "bg-gray-900" : "bg-white";
    const borderColor = isDark ? "border-gray-700" : "border-gray-150";

    return (
        <div className={`${bg} min-h-screen`}>
            {/* Header */}
            <header className={`fixed top-0 left-0 w-full z-50 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200" } shadow-sm border-b`}>
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Left: Logo and Tagline */}
                    <div>
                        <img src="/prograbyte1.png" className="w-35" alt="Prograbyte" />
                    </div>

                    {/* Right: Theme Toggle */}
                    <ThemeToggle />
                </div>
            </header>


            {/* Hero Section */}
            <section className="pt-16 mt-16 px-16">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Left: Text Content */}
                    <div className="md:w-2/3 text-center md:text-left">
                        <motion.h2
                            className="text-2xl font-extrabold"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Unlock Your Potential with{" "}
                            <span className="text-red-500 text-3xl italic">Prograbyte</span>
                        </motion.h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-md">
                            Learn from industry experts, master in-demand skills, and build your future.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4 md:justify-start justify-center">
                            <Link
                                to="/register"
                                className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/login"
                                className="border border-red-600 text-red-600 px-6 py-2 rounded-md font-semibold hover:bg-red-600 hover:text-white"
                            >
                                Login
                            </Link>
                        </div>
                    </div>

                    {/* Right: Image/Logo */}
                    <div className="hidden md:flex md:w-1/3 justify-center">
                        <img
                            src="/logo2.png"
                            alt="Learning Illustration"
                            className="max-w-sm w-35 h-auto"
                        />
                    </div>

                </div>
            </section>


            {/* Features Section */}
            <section className="py-16 px-4">
                <h3 className="text-center text-2xl font-bold mb-10">
                    Why Choose <span className="italic text-red-500">Prograbyte?</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            className={`p-6 rounded-md shadow-md ${cardBg} border ${borderColor} text-center transition hover:scale-105`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Register as a Tutor Section */}
            <section className={`py-20 px-16 ${isDark ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"}`}>
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

                    {/* Text */}
                    <div className="md:w-2/3">
                        <h2 className="text-2xl md:text-2xl font-bold mb-4">
                            Become a <span className="text-red-600 text-2xl italic">Prograbyte</span> Tutor
                        </h2>
                        <p className={`mb-6 text-base md:text-lg ${isDark ? "text-gray-400" : "text-gray-700"}`}>
                            Share your knowledge with eager learners around the globe. Teach, inspire, and earn while doing what you love. Whether you're a professional or a passionate expert — we give you the platform.
                        </p>
                        <a
                            href="/tutor-register"
                            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-red-700 transition duration-300"
                        >
                            Apply Now
                        </a>
                    </div>

                    {/* Illustration / Image */}
                    <div className="md:w-1/3 flex justify-center">
                        <img
                            src="/teacher.svg"
                            alt="Teach Online"
                            className="max-w-xs md:max-w-md w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            <section className={`py-20 px-16 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
                <h2 className="text-2xl font-bold text-center mb-10">Popular Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {["Web Dev", "AI/ML", "Cloud", "Data Science"].map((cat, idx) => (
                        <div key={idx} className={`p-6 rounded-lg shadow-md border ${ isDark ? "border-gray-800" : "border-gray-200" } hover:scale-105 transition`}>
                            <h3 className="text-xl font-semibold text-center">{cat}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPagePart;


function ThemeToggle() {
    const { theme, toggleDarkMode } = useTheme();
    const isDark = theme.includes("dark");
    return (
        <button
            onClick={toggleDarkMode}
            className={`relative flex items-center w-12 h-6 bg-transparent border ${isDark ? "border-red-400 shadow-lg" : " shadow-sm border-red-400"} rounded-full p-1 transition-all`}
        >
            {isDark ? (
                <Moon className="absolute left-2 text-red-400" size={14} />
            ) : (
                <Sun className="absolute right-2 text-red-500" size={14} />
            )}
            <motion.div
                className={`absolute w-4 h-4 bg-red-400 rounded-full shadow-md`}
                animate={{ x: isDark ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
        </button>
    );
}