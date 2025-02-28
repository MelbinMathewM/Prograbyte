import { useContext, useEffect } from "react";
import DashboardPart from "../../components/admin/dashboard-part";
import FooterPart from "../../components/admin/footer";
import NavbarPart from "../../components/admin/navbar";


const Dashboard = () => {
    // const { setTheme } = useTheme();
    // const { id, accessToken } = useUser();

    // useEffect(() => {
    //     if (user.role === "admin") {
    //         setTheme("admin-theme");
    //     }
    // }, [user.role, setTheme]);

    return (
        <>
            <NavbarPart />
            <div className="pt-15">
                <DashboardPart />
            </div>
            <FooterPart />
        </>
    );
};

export default Dashboard;
