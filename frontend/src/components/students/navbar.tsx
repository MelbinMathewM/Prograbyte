import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { useTheme } from "../../contexts/theme-context";
import { motion } from "framer-motion";
import { Sun, Moon, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

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
        <Link to="/" className="text-xl font-bold italic text-blue-600">
          Prograbyte
        </Link>

        {/* Navigation Links (Desktop) */}
        <ul className="flex space-x-6 hidden md:flex">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${isActive ? "text-blue-600" : theme.includes("dark") ? "text-gray-300 hover:text-blue-500" : "text-gray-800 hover:text-blue-500"}`
              }>
              Home
            </NavLink>
          </li>
          {["Courses", "Blog"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-lg transition-colors duration-300 ${isActive ? "text-blue-600 font-medium" : theme.includes("dark") ? "text-gray-300 hover:text-blue-500" : "text-gray-800 hover:text-blue-500"}`
                }>
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Auth Section (Desktop) */}
        <div className="flex items-center space-x-6 hidden md:flex">
          <ThemeToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-md transition flex items-center ${isActive
                      ? "text-blue-600"
                      : theme.includes("dark")
                        ? "text-gray-300 hover:text-blue-500 hover:bg-blue-500"
                        : "text-gray-800 hover:text-blue-500 hover:bg-blue-500"
                    }`
                  }
                >
                  <FaUserCircle size={15} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `text-md transition flex items-center ${isActive
                      ? "text-red-600"
                      : theme.includes("dark")
                        ? "text-gray-300 hover:text-blue-500 hover:bg-blue-500"
                        : "text-gray-800 hover:text-blue-500 hover:bg-blue-500"
                    }`
                  }>
                  <FaHeart size={15} />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Wishlist</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isMobileMenuOpen && (
          <div className={`absolute top-16 right-0 w-full shadow-md rounded-md md:hidden ${theme.includes("dark") ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <NavLink to="/profile" className="text-lg flex items-center hover:text-blue-500 transition">
                <FaUserCircle className="mr-2" /> Profile
              </NavLink>
              <NavLink to="/wishlist" className="text-lg flex items-center hover:text-blue-500 transition">
                <FaHeart className="mr-2" /> Wishlist
              </NavLink>
              <ThemeToggle />
            </div>
            <ul className="flex flex-col space-y-4 py-4 px-6">
              <li>
                <NavLink to="/" className="text-lg hover:text-blue-500 transition">
                  Home
                </NavLink>
              </li>
              {["Courses", "Blog"].map((item) => (
                <li key={item}>
                  <NavLink to={`/${item.toLowerCase()}`} className="text-lg hover:text-blue-500 transition">
                    {item}
                  </NavLink>
                </li>
              ))}
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
      className={`relative flex items-center w-12 h-6 bg-transparent ${isDark ? "border border-gray-700 shadow-lg" : " shadow-sm"} rounded-full p-1 transition-all`}
    >
      {isDark ? (
        <Moon className="absolute left-2 text-white" size={14} />
      ) : (
        <Sun className="absolute right-2 text-yellow-500" size={14} />
      )}

      <motion.div
        className={`absolute w-4 h-4 ${isDark ? "bg-gray-600 border border-gray-500 shadow-md" : "bg-white"} rounded-full shadow-md`}
        animate={{ x: isDark ? 22 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </button>
  );
}
