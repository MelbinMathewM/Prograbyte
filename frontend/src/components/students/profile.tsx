import { useContext } from "react"
import { UserContext } from "../../contexts/user-context"

const ProfilePart = () => {
    const context = useContext(UserContext);
    if(!context) return null;
    const { logout } = context;
    return (
        <div>
            <button onClick={() => logout()}>logout</button>
            <p>Want to be a tutor? <span >Click here</span></p>
        </div>
    )
}

export default ProfilePart;

