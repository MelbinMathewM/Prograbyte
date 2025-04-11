import Dashboard from "@/components/tutors/dashboard-part";
import TutorFooter from "@/components/tutors/footer";
import TutorNavbar from "@/components/tutors/navbar"

const TutorDashboard = () => {
    return (
        <div>
            <TutorNavbar />
            <div className="pt-20">
                <Dashboard />
            </div>
            <TutorFooter />
        </div>
    )
}

export default TutorDashboard;