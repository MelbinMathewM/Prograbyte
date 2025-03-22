import { Outlet } from "react-router-dom";
import StudentNavbar from "@/components/students/navbar";

const StudentLayout = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <Outlet />
            </div>
        </div>
    );
};

export default StudentLayout;
