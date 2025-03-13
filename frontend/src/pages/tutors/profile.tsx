import TutorFooter from "../../components/tutors/footer"
import TutorNavbar from "../../components/tutors/navbar"
import TutorProfilePart from "../../components/tutors/profile-part";

const TutorProfile = () => {
    return (
        <div>
            <TutorNavbar />
            <div className="pt-15">
                <TutorProfilePart />
            </div>
            <TutorFooter />
        </div>
    )
}

export default TutorProfile;