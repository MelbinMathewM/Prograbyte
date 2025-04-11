import TutorMyCoursesPart from "@/components/tutors/my-courses"
import TutorNavbar from "@/components/tutors/navbar"

const TutorMyCourses = () => {
    return (
        <div>
            <TutorNavbar />
            <div className="pt-15">
                <TutorMyCoursesPart />
            </div>
        </div>
    )
}

export default TutorMyCourses;