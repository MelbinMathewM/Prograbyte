import MyCoursesPart from "../../components/students/my-courses"
import StudentNavbar from "../../components/students/navbar"

const MyCourses = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <MyCoursesPart />
            </div>
        </div>
    )
}

export default MyCourses;