import { ToastContainer } from "react-toastify";
import CourseDetailPart from "../../components/admin/course-detail-part";
import FooterPart from "../../components/admin/footer";
import NavbarPart from "../../components/admin/navbar";

const AdminCourseDetail = () => {
    return (
        <div>
            <NavbarPart />
            <ToastContainer />
            <div className="pt-20">
                <CourseDetailPart />
            </div>
            <FooterPart />
        </div>
    )
}

export default AdminCourseDetail;