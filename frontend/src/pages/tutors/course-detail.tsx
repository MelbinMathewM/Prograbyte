import TutorCourseDetailPart from "../../components/tutors/course-detail-part"
import TutorFooter from "../../components/tutors/footer";
import TutorNavbar from "../../components/tutors/navbar"

const TutorCourseDetail = () => {
    return (
        <div> 
            <TutorNavbar />
            <div className="pt-20">
                <TutorCourseDetailPart />
            </div>
            <TutorFooter />
        </div>
    )
}

export default TutorCourseDetail;