import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle, FaHeart, FaBell } from "react-icons/fa";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { liveSocket, SOCKET_EVENTS } from "@/configs/socketConfig";

const StudentNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark-theme";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    liveSocket.on(SOCKET_EVENTS.LIVE_CLASS_STARTED, (data: { schedule_id: string, streamUrl: string, streamKey: string, message: string }) => {
      console.log("Live class started:", data);
      setNotifications((prev) => [
        ...prev,
        { message: data.message, streamUrl: data.streamUrl }
      ]);
      setShowNotifications(true);
    });

    return () => {
      liveSocket.off(SOCKET_EVENTS.LIVE_CLASS_STARTED);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full backdrop-blur-md z-50 shadow-md ${theme.includes("dark") ? "bg-gray-900/80 text-white" : "bg-white/70 text-gray-800"}`}>
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold italic text-blue-600">
          <img  src="/prograbyte-blue1.png" className="w-35" alt="Logo Name"/>
        </Link>

        {/* Navigation Links (Desktop) */}
        <ul className="flex space-x-6 hidden md:flex">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${isActive ? "text-blue-400" : theme.includes("dark") ? "text-gray-300 hover:text-blue-500" : "text-gray-800 hover:text-blue-500"}`
              }>
              Home
            </NavLink>
          </li>
          {["Courses", "Blog"].map((item) => (
            <li key={item}>
              <NavLink
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `text-lg transition-colors duration-300 ${isActive ? "text-blue-400 font-medium" : theme.includes("dark") ? "text-gray-300 hover:text-blue-500" : "text-gray-800 hover:text-blue-500"}`
                }>
                {item}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth Section (Desktop) */}
        <div className="flex items-center space-x-6 hidden md:flex">
          {/* Notifications Icon */}
          <div className="relative">
            <button onClick={toggleNotifications} className="relative focus:outline-none">
              <FaBell size={15} className="hover:text-blue-500 transition" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-64 ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-lg shadow-lg overflow-hidden z-50`}>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm">No notifications</div>
                ) : (
                  notifications.map((note, index) => (
                    <div key={index} className={`p-4 border-b ${isDark ? "hover:bg-blue-900" : "hover:bg-blue-100"} cursor-pointer`}>
                      📢 {note.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <ThemeToggle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-md transition flex items-center hover:text-blue-400 ${isActive ? "text-blue-400" : isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-800 hover:text-blue-400"}`
                  }>
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
                    `text-md transition flex items-center hover:text-blue-400 ${isActive ? "text-blue-400" : isDark ? "text-gray-300 hover:text-blue-400" : "text-gray-800 hover:text-blue-400"}`
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
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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

// Theme Toggle stays same
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
