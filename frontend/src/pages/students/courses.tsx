import StudentCoursePart from "../../components/students/course-part"
import StudentNavbar from "../../components/students/navbar";

const CoursePage = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <StudentCoursePart />
            </div>
        </div>
    )
}

export default CoursePage;