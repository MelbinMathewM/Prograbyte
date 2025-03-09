import { ToastContainer } from "react-toastify";
import AddTopicPart from "../../components/tutors/add-topic-part"
import TutorNavbar from "../../components/tutors/navbar"

const AddTopic = () => {
    return (
        <div>
            <ToastContainer />
            <TutorNavbar />
            <div className="pt-20">
                <AddTopicPart />
            </div>
        </div>
    )
}

export default AddTopic;