import { useState } from "react";
import Sidebar from "../../components/admin/sidebar";
import { Outlet } from "react-router-dom";
import Loader from "../../components/ui/loader";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar (Fixed) */}
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {/* Content Section */}
            <div className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-16"} pt-16 overflow-y-auto`}>
                <Loader />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
