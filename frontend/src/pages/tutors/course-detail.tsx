import { ToastContainer } from "react-toastify";
import TutorCourseDetailPart from "@/components/tutors/course-detail-part"
import TutorFooter from "@/components/tutors/footer";
import TutorNavbar from "@/components/tutors/navbar"

const TutorCourseDetail = () => {
    return (
        <div> 
            <ToastContainer />
            <TutorNavbar />
            <div className="pt-16">
                <TutorCourseDetailPart />
            </div>
            <TutorFooter />
        </div>
    )
}

export default TutorCourseDetail;