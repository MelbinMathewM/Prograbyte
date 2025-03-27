import TutorNavbar from "@/components/tutors/navbar"
import TutorLive from "@/components/tutors/tutor-live";

const Streaming = () => {
    return (
        <div>
            <TutorNavbar />
            <div className="pt-20">
                <TutorLive />
            </div>
        </div>
    )
}

export default Streaming;