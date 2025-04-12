// src/modules/student/StudentRoutes.tsx
import { Route } from "react-router-dom";
import Home from "@/pages/students/home";
import Wishlist from "@/pages/students/wishlist";
import StudentProfile from "@/pages/students/profile";
import VideoPage from "@/pages/students/video";
import NotesPage from "@/pages/students/notes";
import Checkout from "@/pages/students/checkout";
import ProtectedRoute from "@/routes/protectedRoutes";
import CoursePage from "@/pages/students/courses";
import StudentCourseDetail from "@/pages/students/course-detail";
import MyCourses from "@/pages/students/my-courses";
import Premium from "@/pages/students/premium";
import PaymentSuccess from "@/pages/students/payment-success";
import PaymentFailure from "@/pages/students/payment-failure";
import Blog from "@/pages/students/blog";
import StudentLayout from "./student-layout";
import PublicProfile from "@/pages/students/public-profile";
import Chat from "@/pages/students/chat";
import Live from "@/pages/students/live";

const StudentRoutes = () => {
    return (
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<StudentLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/courses" element={<CoursePage />} />
                <Route path="/courses/:id" element={<StudentCourseDetail />} />
                <Route path="/courses/:courseName/topics/:topicsId/video/:topicId" element={<VideoPage />} />
                <Route path="/courses/:courseName/topics/:topicsId/notes/:topicId" element={<NotesPage />} />
                <Route path="/checkout/:courseId" element={<Checkout />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/profile/my-courses" element={<MyCourses />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile/premium" element={<Premium />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/profile/:username" element={ <PublicProfile /> } />
                <Route path="/blog/chat" element={ <Chat /> } />
                <Route path="/courses/live/:schedule_id" element={ <Live /> } />
            </Route>
        </Route>
    );
};

export default StudentRoutes;
