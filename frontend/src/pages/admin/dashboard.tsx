import { useContext, useEffect } from "react";
import DashboardPart from "../../components/admin/dashboard-part";
import FooterPart from "../../components/admin/footer";


const Dashboard = () => {

    return (
        <>
            <div>
                <DashboardPart />
                <FooterPart />
            </div>
        </>
    );
};

export default Dashboard;
