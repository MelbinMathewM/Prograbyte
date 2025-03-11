import StudentNavbar from "../../components/students/navbar";
import ProfilePart from "../../components/students/profile"

const StudentProfile = () => {
    return (
        <>
                <StudentNavbar />
                <div className="pt-15">
                    <ProfilePart />
                </div>
        </>
    )
}

export default StudentProfile;