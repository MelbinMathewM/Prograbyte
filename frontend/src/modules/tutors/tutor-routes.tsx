// src/modules/tutor/TutorRoutes.tsx
import { Route } from "react-router-dom";
import TutorDashboard from "@/pages/tutors/dashboard";
import MyCourses from "@/pages/tutors/my-courses";
import AddCourse from "@/pages/tutors/add-course";
import TutorProfile from "@/pages/tutors/profile";
import CourseDetail from "@/pages/tutors/course-detail";
import AddTopic from "@/pages/tutors/add-topic";
import ProtectedRoute from "@/routes/protectedRoutes";
import TCourse from "@/pages/tutors/courses";
import Live from "@/pages/tutors/live";
import Streaming from "@/pages/tutors/streaming";
import TutorLayout from "./tutor-layout";
import Wallet from "@/pages/tutors/wallet";

const TutorRoutes = () => {
    return (
        <Route element={<ProtectedRoute allowedRoles={["tutor"]} />}>
            <Route element={<TutorLayout />}>
                <Route path="/tutor/dashboard" element={<TutorDashboard />} />
                <Route path="/tutor/courses" element={<TCourse />} />
                <Route path="/tutor/courses/:id" element={<CourseDetail />} />
                <Route path="/tutor/courses/add-course" element={<AddCourse />} />
                <Route path="/tutor/courses/:courseId/add-topic" element={<AddTopic />} />
                <Route path="/tutor/profile" element={<TutorProfile />} />
                <Route path="/tutor/profile/my-courses" element={<MyCourses />} />
                <Route path="/tutor/live" element={<Live />} />
                <Route path="/tutor/live/:schedule_id" element={<Streaming />} />
                <Route path="/tutor/profile/wallet" element={ <Wallet /> } />
            </Route>
        </Route>
    );
};

export default TutorRoutes;
