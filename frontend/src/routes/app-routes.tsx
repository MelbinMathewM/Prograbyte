import { Routes, Route } from "react-router-dom";
import AdminRoutes from "../modules/admin/admin-routes";
import TutorRoutes from "../modules/tutors/tutor-routes";
import StudentRoutes from "../modules/students/student-routes";
import LandingPage from "../pages/students/landing-page";
import StudentRegister from "../pages/students/register";
import StudentLogin from "../pages/students/login";
import LoginCallback from "../pages/students/login-callback";
import ResetPassword from "../pages/students/reset-password";
import TutorRegister from "../pages/students/tutor-register";
import { ThemeProvider } from "../contexts/theme-context";
import NotFound from "../pages/404";

const AppRoutes = () => {
    return (
        <ThemeProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<StudentRegister />} />
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/login/callback" element={<LoginCallback />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/tutor-register" element={<TutorRegister />} />

                {/* Role-based Routes */}
                {AdminRoutes()}
                {TutorRoutes()}
                {StudentRoutes()}

                {/* 404 Page */}
                <Route path="*" element={ <NotFound /> } />
            </Routes>
        </ThemeProvider>
    );
};

export default AppRoutes;
