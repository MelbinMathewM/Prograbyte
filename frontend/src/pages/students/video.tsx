import StudentNavbar from "../../components/students/navbar"
import VideoPart from "../../components/students/video"

const VideoPage = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <VideoPart />
            </div>
        </div>
    )
}

export default VideoPage;