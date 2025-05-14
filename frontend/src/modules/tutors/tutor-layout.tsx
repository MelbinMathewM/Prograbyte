import { Outlet } from "react-router-dom";
import TutorNavbar from "@/components/tutors/navbar";
import { ToastContainer } from "react-toastify";

const TutorLayout = () => {
    return (
        <div>
            <TutorNavbar />
            <ToastContainer />
            <div className="pt-15">
                <Outlet />
            </div>
        </div>
    );
};

export default TutorLayout;
