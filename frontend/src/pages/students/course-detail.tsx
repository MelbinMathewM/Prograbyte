import StudentCourseDetailPart from "../../components/students/course-detail-part";
import StudentNavbar from "../../components/students/navbar";

const StudentCourseDetail = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <StudentCourseDetailPart />
            </div>
        </div>
    )
}

export default StudentCourseDetail;