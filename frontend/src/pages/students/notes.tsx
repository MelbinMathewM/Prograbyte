import StudentNavbar from "../../components/students/navbar"
import ViewNotes from "../../components/students/notes"

const NotesPage = () => {
    return (
        <div>
            <StudentNavbar />
            <div className="pt-15">
                <ViewNotes />
            </div>
        </div>
    )
}

export default NotesPage;