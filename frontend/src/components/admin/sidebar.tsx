import { Link, useLocation } from "react-router-dom";
import {
    Menu, X, LayoutDashboard, List, Users, Tag, Ticket, FileText, User,
    Bell, Settings, Moon, Sun
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { motion } from "framer-motion";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Payments } from "@mui/icons-material";

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
    const location = useLocation();
    const { theme } = useTheme();
    const isDark = theme.includes("dark");
    const isActive = (path: string) => location.pathname.startsWith(path);

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Categories", path: "/admin/categories", icon: <List size={20} /> },
        { name: "Tutors", path: "/admin/tutors", icon: <FaChalkboardTeacher size={20} /> },
        { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
        { name: "Offers", path: "/admin/offers", icon: <Tag size={20} /> },
        { name: "Coupons", path: "/admin/coupons", icon: <Ticket size={20} /> },
        { name: "Payments", path: "/admin/payments", icon: <Payments /> },
        { name: "Blog", path: "/blog", icon: <FileText size={20} /> },
        { name: "Profile", path: "/admin/profile", icon: <User size={20} /> },
    ];

    return (
        <>
            {/* Top Navbar */}
            <div className={`fixed top-0 left-0 w-full px-2 py-2 z-40 flex items-center justify-between transition-all 
                ${isDark ? "bg-blue-950 text-white" : "bg-white text-gray-900 shadow-md"}
            `}>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="p-2 rounded-lg hover:bg-opacity-50 transition-all"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link to="/" className="text-xl font-bold px-4 italic">
                        Prograbyte
                    </Link>
                </div>

                <div className="flex space-x-6 me-4">
                    <ThemeToggle />
                    <button className="hover:text-gray-500 transition-all">
                        <Bell size={18} />
                    </button>
                    <button className="hover:text-gray-500 transition-all">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside 
                className={`fixed top-14 left-0 h-screen transition-all duration-300 ease-in-out z-50
                    ${isDark ? "bg-blue-950 text-white" : "bg-white text-gray-900 shadow-lg"}
                    ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:w-16 lg:translate-x-0"}
                `}
            >
                <nav className="flex flex-col">
                    {menuItems.map(({ name, path, icon }) => (
                        <Link
                            key={name}
                            to={path}
                            className={`flex items-center px-4 py-3 transition-all 
                                ${isActive(path) ? "bg-blue-600 font-bold text-white" : "hover:bg-opacity-50"}
                                ${isOpen ? "gap-4" : "lg:justify-center"}
                            `}
                        >
                            {icon}
                            <span className={`${isOpen ? "block" : "lg:hidden"}`}>
                                {name}
                            </span>
                        </Link>
                    ))}
                </nav>
            </aside>

        </>
    );
};

export default Sidebar;

function ThemeToggle() {
    const { theme, toggleDarkMode } = useTheme();
    const isDark = theme.includes("dark");

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative flex items-center w-12 h-6 rounded-full p-1 transition-all 
                ${isDark ? "bg-blue-900 border border-blue-700" : "bg-gray-200"}
            `}
        >
            {isDark ? (
                <Moon className="absolute left-2 text-white" size={14} />
            ) : (
                <Sun className="absolute right-2 text-yellow-500" size={14} />
            )}

            <motion.div
                className={`absolute w-4 h-4 rounded-full shadow-md
                    ${isDark ? "bg-blue-800 border border-blue-600" : "bg-white"}
                `}
                animate={{ x: isDark ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
        </button>
    );
}
