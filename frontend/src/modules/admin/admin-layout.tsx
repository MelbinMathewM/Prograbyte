import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/sidebar";
import Loader from "@/components/ui/loader";
import AdminFooter from "@/components/admin/footer";

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            const isLargeScreen = window.innerWidth >= 1024;
            setIsMobile(!isLargeScreen);
            if (isLargeScreen) {
                setIsOpen(true);
            }
        };
        
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="h-screen w-full flex bg-gray-100">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-transparent backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <main 
                className={`flex-1 transition-all duration-300 pt-14
                    ${isMobile ? 'ml-0' : (isOpen ? 'ml-64' : 'ml-16')}`}
            >
                <Loader />
                <Outlet />
                <AdminFooter />
            </main>
        </div>
    );
};

export default AdminLayout;