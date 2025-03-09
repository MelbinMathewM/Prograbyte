import { useState } from "react";
import Sidebar from "../components/admin/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="flex h-screen">
            {/* Sidebar with fixed width */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Main content */}
            <div
                className={`transition-all duration-300 p-6 overflow-auto ${isOpen ? "ml-64" : "ml-16"
                    }`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
