import { useContext } from "react";
import { AdminContext } from "../../contexts/admin-context";

const AdminProfilePart = () => {

    const { logout } = useContext(AdminContext) || {};

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

export default AdminProfilePart;