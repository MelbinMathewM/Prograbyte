import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";

const TutorNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); 
    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className={`fixed w-full py-4 px-6 shadow-lg z-50 transition-all ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <div className="container mx-auto flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/tutor/dashboard" className="text-xl font-bold italic">Prograbyte</Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6">
                    {[
                        { name: "Dashboard", path: "/tutor/dashboard" },
                        { name: "Courses", path: "/tutor/courses" },
                        { name: "Live", path: "/tutor/live" },
                        { name: "Payments", path: "/tutor/payments" },
                        { name: "Blog", path: "/tutor/blog" }
                    ].map(({ name, path }) => (
                        <li key={path}>
                            <Link 
                                to={path} 
                                className={`hover:text-blue-400 transition ${isActive(path) ? "font-bold text-blue-400" : ""}`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Profile & Theme Toggle */}
                <div className="hidden md:flex items-center space-x-4">
                    <ThemeToggle />
                    <Link 
                        to="/tutor/profile" 
                        className={`flex items-center space-x-2 hover:text-blue-400 transition ${isActive("/tutor/profile") ? "font-bold text-blue-400" : ""}`}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.ul 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className={`md:hidden flex flex-col items-center space-y-4 mt-4 py-4 rounded-lg transition-all ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}
                >
                    {[
                        { name: "Dashboard", path: "/tutor/dashboard" },
                        { name: "Courses", path: "/tutor/courses" },
                        { name: "Live", path: "/tutor/live" },
                        { name: "Payments", path: "/tutor/payments" },
                        { name: "Blog", path: "/tutor/blog" },
                        { name: "Profile", path: "/tutor/profile" }
                    ].map(({ name, path }) => (
                        <li key={path}>
                            <Link 
                                to={path} 
                                className={`hover:text-blue-400 transition ${isActive(path) ? "font-bold text-blue-400" : ""}`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <ThemeToggle />
                    </li>
                </motion.ul>
            )}
        </nav>
    );
};

export default TutorNavbar;

function ThemeToggle() {
    const { theme, toggleDarkMode } = useTheme();
    const isDark = theme.includes("dark");

    return (
      <button
        onClick={toggleDarkMode}
        className={`relative flex items-center w-10 h-6 rounded-full p-1 transition-all border ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-100"}`}
      >
        {/* Icons */}
        <div className={`absolute left-1 ${isDark ? "text-yellow-400" : "text-gray-700"}`}>
          <Sun size={14} />
        </div>
        <div className={`absolute right-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          <Moon size={14} />
        </div>

        {/* Animated Toggle Slider */}
        <motion.div
          className={`absolute w-4 h-4 rounded-full shadow-md transition-all border ${isDark ? "bg-gray-700 border-gray-600 " : "bg-white"}`}
          animate={{ x: isDark ? 14 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </button>
    );
}
