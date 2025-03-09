import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, List, Users, Tag, Ticket, FileText, User } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
        { name: "Categories", path: "/admin/categories", icon: <List size={20} /> },
        { name: "Tutors", path: "/tutors", icon: <Users size={20} /> },
        { name: "Offers", path: "/offers", icon: <Tag size={20} /> },
        { name: "Coupons", path: "/admin/coupons", icon: <Ticket size={20} /> },
        { name: "Blog", path: "/blog", icon: <FileText size={20} /> },
        { name: "Profile", path: "/admin/profile", icon: <User size={20} /> },
    ];

    return (
        <div className={`bg-gray-900 text-white h-screen transition-all duration-300 ${isOpen ? "w-64" : "w-16"} fixed top-0 left-0`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-4">
                <Link to="/" className={`text-xl font-bold italic ${isOpen ? "block" : "hidden"}`}>
                    Prograbyte
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Links */}
            <nav className="mt-6">
                {menuItems.map(({ name, path, icon }) => (
                    <Link
                        key={name}
                        to={path}
                        className={`flex items-center gap-4 px-4 py-3 transition-all ${
                            isActive(path) ? "bg-secondary font-bold text-lg" : "hover:bg-gray-600"
                        }`}
                    >
                        {icon}
                        <span className={`${isOpen ? "block" : "hidden"}`}>{name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
