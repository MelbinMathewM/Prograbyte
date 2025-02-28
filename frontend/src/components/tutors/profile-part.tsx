import { useContext } from "react";
import { TutorContext } from "../../contexts/tutor-context";

const TutorProfilePart = () => {

    const { logout} = useContext(TutorContext) || {};

    const handleLogout = () => {
        if(logout){ 
            logout(); 
        }
    }

    return (
        <div>
            <button onClick={handleLogout} >Logout</button>
        </div>
    )
}

export default TutorProfilePart;