import { Outlet } from "react-router-dom";
import StudentNavbar from "@/components/students/navbar";
import { ToastContainer } from "react-toastify";
import UserFooter from "@/components/students/footer";

const StudentLayout = () => {
    return (
        <div>
            <StudentNavbar />
            <ToastContainer />
            <div className="pt-15">
                <Outlet />
            </div>
            <UserFooter />
        </div>
    );
};

export default StudentLayout;
