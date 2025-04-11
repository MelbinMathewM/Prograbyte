import { ToastContainer } from "react-toastify";
import AddCoursePart from "@/components/tutors/add-course-part"
import TutorFooter from "@/components/tutors/footer";
import TutorNavbar from "@/components/tutors/navbar"

const AddCourse = () => {
    return (
        <div>
            <ToastContainer />
            <TutorNavbar />
            <div className="pt-20">
                <AddCoursePart />
            </div>
            <TutorFooter />
        </div>
    )
}

export default AddCourse;