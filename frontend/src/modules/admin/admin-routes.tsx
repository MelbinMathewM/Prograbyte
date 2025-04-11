import { Route } from "react-router-dom";
import AdminLayout from "./admin-layout";
import Dashboard from "@/pages/admin/dashboard";
import Categories from "@/pages/admin/categories";
import AdminCourses from "@/pages/admin/courses";
import AdminProfile from "@/pages/admin/profile";
import CourseDetail from "@/pages/admin/course-detail";
import ProtectedRoute from "@/routes/protectedRoutes";
import VideoPageAdmin from "@/pages/admin/video";
import TutorPage from "@/pages/admin/tutor";
import TutorDetail from "@/pages/admin/tutor-detail";
import UserPage from "@/pages/admin/user";

const AdminRoutes = () => {
    return (
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/categories/courses/:categoryName/:categoryId" element={<AdminCourses />} />
                <Route path="/admin/categories/courses/:courseId" element={<CourseDetail />} />
                <Route path="/admin/categories/courses/:courseName/topics/:topicsId/video/:topicId" element={<VideoPageAdmin />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/tutors" element={ <TutorPage /> } />
                <Route path="/admin/tutors/:id" element={ <TutorDetail /> } />
                <Route path='/admin/users' element={ <UserPage /> } />
            </Route>
        </Route>    
    );
};

export default AdminRoutes;
