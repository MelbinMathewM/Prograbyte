import { Link, Outlet, useLocation } from "react-router-dom";
import { 
    Menu, X, LayoutDashboard, List, Users, Tag, Ticket, FileText, User, 
    Bell, Settings 
} from "lucide-react";

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
        <>
            {/* Full-Width Top Navbar */}
            <div className="fixed top-0 left-0 w-full bg-gray-900 text-white flex items-center justify-between px-6 py-4 z-50">
                <div className="flex items-center space-x-3">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <Link to="/" className={`text-xl font-bold px-4 italic transition-all`}>
                        Prograbyte
                    </Link>
                </div>

                {/* Notifications & Settings */}
                <div className="flex space-x-8 me-4">
                    <button className="hover:text-gray-300">
                        <Bell size={16} />
                    </button>
                    <button className="hover:text-gray-300">
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Sidebar (Fixed Left) */}
            <div className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-64" : "w-16"} pt-16`}>
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
        </>
    );
};

export default Sidebar;
