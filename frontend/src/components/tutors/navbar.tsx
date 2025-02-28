import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

const TutorNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); 

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className="fixed w-full bg-gray-900 text-white py-4 px-6 shadow-lg z-50">
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
                                className={`hover:text-blue-400 ${isActive(path) ? "font-bold text-blue-400" : ""}`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Profile Dropdown */}
                <div className="hidden md:block relative">
                    <button className="flex items-center space-x-2 hover:text-blue-400">
                        <User size={20} />
                        <Link 
                            to="/tutor/profile"
                            className={`hover:text-blue-400 ${isActive("/tutor/profile") ? "font-bold text-blue-400" : ""}`}>
                            Profile
                        </Link>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-gray-800 py-4">
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
                                className={`hover:text-blue-400 ${isActive(path) ? "font-bold text-blue-400" : ""}`}
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default TutorNavbar;
