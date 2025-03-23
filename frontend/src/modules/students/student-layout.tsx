import { Outlet } from "react-router-dom";
import StudentNavbar from "@/components/students/navbar";
import { ToastContainer } from "react-toastify";

const StudentLayout = () => {
    return (
        <div>
            <StudentNavbar />
            <ToastContainer />
            <div className="pt-15">
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout;
