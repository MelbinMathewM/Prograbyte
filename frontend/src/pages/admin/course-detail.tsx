import { ToastContainer } from "react-toastify";
import CourseDetailPart from "../../components/admin/course-detail-part";
import FooterPart from "../../components/admin/footer";

const AdminCourseDetail = () => {
    return (
        <div>
            <ToastContainer />
            <CourseDetailPart />
            <FooterPart />
        </div>
    )
}

export default AdminCourseDetail;