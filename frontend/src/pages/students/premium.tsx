import { ToastContainer } from "react-toastify";
import StudentNavbar from "../../components/students/navbar"
import PremiumPage from "../../components/students/premium-member"

const Premium = () => {
    return (
        <div>
            <ToastContainer />
            <StudentNavbar />
            <div>
                <PremiumPage />
            </div>
        </div>
    )
}

export default Premium;