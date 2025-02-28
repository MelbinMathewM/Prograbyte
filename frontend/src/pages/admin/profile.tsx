import FooterPart from "../../components/admin/footer";
import NavbarPart from "../../components/admin/navbar"
import AdminProfilePart from "../../components/admin/profile"

const AdminProfile = () => {
    return (
        <div>
            <NavbarPart />
            <div className="pt-20">
                <AdminProfilePart />
            </div>
            <FooterPart />
        </div>
    )
}

export default AdminProfile;