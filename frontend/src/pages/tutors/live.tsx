import LivePart from "@/components/tutors/live-page"
import TutorNavbar from "@/components/tutors/navbar"
import { ToastContainer } from "react-toastify";

const Live = () => {
    return (
        <div>
            <ToastContainer />
            <TutorNavbar />
            <div className="pt-20">
                <LivePart />
            </div>
        </div>
    )
}

export default Live;