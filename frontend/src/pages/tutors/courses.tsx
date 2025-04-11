import TutorNavbar from "@/components/tutors/navbar"
import CoursePart from "@/components/tutors/course-part";
import TutorFooter from "@/components/tutors/footer";


const TCourse = () => {
    return (
        <>
            <TutorNavbar/>
            <div className="pt-15">
                <CoursePart />
            </div>
            <TutorFooter />
        </>
    )
}

export default TCourse;