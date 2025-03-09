import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { useTheme } from "../../contexts/theme-context";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const StudentNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full backdrop-blur-md z-50 shadow-md ${theme.includes("dark") ? "bg-gray-900/80 text-white" : "bg-white/70 text-gray-800"}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold italic text-red-600">
          Prograbyte
        </Link>

        {/* Navigation Links (Desktop) */}
        <ul className="flex space-x-6 hidden md:flex">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-lg font-semibold transition-colors duration-300 ${isActive ? "text-red-600" : theme.includes("dark") ? "text-gray-300 hover:text-red-500" : "text-gray-800 hover:text-red-500"}`
              }>
              Home
            </NavLink>
          </li>
          {["Courses", "Blog"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-lg font-semibold transition-colors duration-300 ${isActive ? "text-red-600" : theme.includes("dark") ? "text-gray-300 hover:text-red-500" : "text-gray-800 hover:text-red-500"}`
                }>
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Auth Section (Desktop) */}
        <div className="flex items-center space-x-6 hidden md:flex">
              <ThemeToggle />
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `text-lg font-semibold transition flex items-center ${isActive ? "text-red-600" : theme.includes("dark") ? "text-gray-300 hover:text-red-500" : "text-gray-800 hover:text-red-500"}`
                }>
                <FaUserCircle className="mr-2" />
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `text-lg font-semibold transition flex items-center ${isActive ? "text-red-600" : theme.includes("dark") ? "text-gray-300 hover:text-red-500" : "text-gray-800 hover:text-red-500"}`
                }>
                <FaShoppingCart className="mr-2" />
              </NavLink>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className={`absolute top-16 right-0 w-full shadow-md rounded-md md:hidden ${theme.includes("dark") ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
                  <NavLink to="/profile" className="text-lg font-semibold flex items-center hover:text-red-500 transition">
                    <FaUserCircle className="mr-2" /> Profile
                  </NavLink>
                  <NavLink to="/cart" className="text-lg font-semibold flex items-center hover:text-red-500 transition">
                    <FaShoppingCart className="mr-2" /> Cart
                  </NavLink>
            </div>
            <ul className="flex flex-col space-y-4 py-4 px-6">
              <li>
                <NavLink to="/" className="text-lg font-semibold hover:text-red-500 transition">
                  Home
                </NavLink>
              </li>
              {["Courses", "Blog"].map((item) => (
                <li key={item}>
                  <NavLink to={`/${item.toLowerCase()}`} className="text-lg font-semibold hover:text-red-500 transition">
                    {item}
                  </NavLink>
                </li>
              ))}
              <li>
                <ThemeToggle />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;

function ThemeToggle() {
  const { theme, toggleDarkMode } = useTheme();
  const isDark = theme.includes("dark");
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative flex items-center w-16 h-8 ${isDark ? "bg-gray-500" : "bg-gray-400 text-white"} rounded-full p-1 transition-all`}
    >
      {/* Icons */}
      <div className="absolute left-2 text-yellow-500">
        <Sun size={18} />
      </div>
      <div className={`absolute right-2 ${isDark ? "text-white" : "text-white"}`}>
        <Moon size={18} />
      </div>

      {/* Animated Slider */}
      <motion.div
        className={`absolute w-6 h-6 ${isDark ? "bg-gray-800 text-white" : "bg-white text-white"} rounded-full shadow-md`}
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </button>
  );
}
