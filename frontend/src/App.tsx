import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/admin/dashboard";
import Categories from "./pages/admin/categories";
import AdminCourses from "./pages/admin/courses";
import CourseDetail from "./pages/admin/course-detail";
import TCourse from "./pages/tutors/courses";
import Home from "./pages/students/home";
import StudentRegister from "./pages/students/register";
import StudentLogin from "./pages/students/login";
import { ThemeProvider } from "./contexts/theme-context";
import ProtectedRoute from "./routes/protectedRoutes";
import Providers from "./Providers";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import StudentProfile from "./pages/students/profile";
import TutorDashboard from "./pages/tutors/dashboard";
import AddCourse from "./pages/tutors/add-course";
import ResetPassword from "./pages/students/reset-password";
import LoginCallback from "./pages/students/login-callback";
import TutorRegister from "./pages/students/tutor-register";
import TutorCourseDetail from "./pages/tutors/course-detail";
import TutorProfile from "./pages/tutors/profile";
import AdminCourseDetail from "./pages/admin/course-detail";
import AdminProfile from "./pages/admin/profile";
import CoursePage from "./pages/students/courses";
import LandingPage from "./pages/students/landing-page";
import StudentCourseDetail from "./pages/students/course-detail";
import Cart from "./pages/students/cart";
import VideoPage from "./pages/students/video";
import NotesPage from "./pages/students/notes";
import AdminLayout from "./routes/adminLayout";
import AddTopic from "./pages/tutors/add-topic";

function App() {
  const { role } = useSelector((state: RootState) => state.auth);

  return (
    <Providers>
      <ThemeProvider role={role}>
        <Routes>
          {/* ✅ Public Routes (No authentication needed) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<StudentRegister />} />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/tutor-register" element={<TutorRegister />} />

          {/* ✅ Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/courses/:id" element={<StudentCourseDetail />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/courses/:courseName/topics/video/:topicId' element={<VideoPage />} />
            <Route path='/courses/:courseName/topics/notes/:topicId' element={<NotesPage />} />
          </Route>

          {/* ✅ Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/categories/courses/:categoryName/:categoryId" element={<AdminCourses />} />
              <Route path="/admin/categories/courses/:courseId" element={<AdminCourseDetail />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>


          {/* ✅ Tutor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["tutor"]} />}>
            <Route path="/tutor/dashboard" element={<TutorDashboard />} />
            <Route path="/tutor/courses" element={<TCourse />} />
            <Route path="/tutor/courses/add-course" element={<AddCourse />} />
            <Route path="/tutor/courses/:courseId/add-topic" element={ <AddTopic /> } />
            <Route path="/tutor/courses/:id" element={<TutorCourseDetail />} />
            <Route path="/tutor/profile" element={<TutorProfile />} />
          </Route>

          {/* ✅ Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/profile" element={<StudentProfile />} />
          </Route>

          {/* ✅ 404 Page */}
          <Route path="*" element={<h1 className="text-center justify-center mt-12 pt-12">404 Not Found</h1>} />
        </Routes>
      </ThemeProvider>
    </Providers>
  );
}

export default App;
