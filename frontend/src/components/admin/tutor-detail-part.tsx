import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types/user";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProfile } from "@/api/profile";
import { Course } from "@/types/course";
import { fetchCoursesByTutor } from "@/api/course";
import { useTheme } from "@/contexts/theme-context";
import { ChevronLeft, ChevronRight, StarIcon } from "lucide-react";
import dayjs from "dayjs";
import AdminPagination from "@/components/admin/pagination";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import NoData from "../ui/no-data";
import { SelectPortal } from "@radix-ui/react-select";

const TutorDetailPart = () => {
    const [tutor, setTutor] = useState<Profile | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("price-low");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const coursesPerPage = 6;
    const navigate = useNavigate();
    const { id } = useParams();
    const { theme } = useTheme();
    const isDark = theme.includes("dark");

    useEffect(() => {
        if (id) {
            fetchTutorDetails(id as string);
            fetchMyCourses(id as string);
        }
    }, [id]);

    const fetchTutorDetails = async (tutorId: string) => {
        setLoading(true);
        try {
            const response = await getProfile(tutorId);
            setTutor(response.user);
        } catch (error) {
            setError("Failed to fetch tutor details");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyCourses = async (tutorId: string) => {
        setLoading(true);
        try {
            const response = await fetchCoursesByTutor(tutorId);
            setCourses(response.courses);
        } catch (err) {
            setError("Failed to fetch courses");
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses
        .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(course => statusFilter === "All" || course.approval_status === statusFilter)
        .sort((a, b) => sortOrder === "price-low" ? a.price - b.price : b.price - a.price);

    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const paginatedCourses = filteredCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);

    return (
        <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
                <nav className="text-sm flex items-center gap-2 text-gray-500">
                    <Link to="/admin/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                    <ChevronRight size={16} />
                    <Link to="/admin/tutors" className="hover:text-blue-400 transition">Tutors</Link>
                    <ChevronRight size={16} />
                    <span className="text-blue-400">{tutor?.name || "Loading..."}</span>
                </nav>

                <div className="flex justify-between items-center mb-6 border-gray-700 pb-4">
                    <h2 className="text-3xl font-bold text-blue-500">Tutor Details</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-blue-400 hover:bg-blue-500 hover:text-white" : "text-blue-500 hover:bg-blue-500 hover:text-white"}`}
                    >
                        <ChevronLeft size={16} />
                        Back
                    </button>
                </div>

                <div className="flex justify-center items-center w-full">
                    {loading ? (
                        <Loading />
                    ) : tutor ? (
                        <div className={`border rounded-sm p-0.5 w-full ${isDark ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-gray-100"}`}>
                            <Card className={`p-5 shadow-md rounded-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-400">{tutor.name}</CardTitle>
                                    <p className="text-gray-400 text-sm">@{tutor.username}</p>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Email</p>
                                        <p className="text-lg">{tutor.email}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Status</p>
                                        <p className={`text-lg font-semibold ${tutor.isTutorVerified ? "text-green-400" : "text-red-400"}`}>
                                            {tutor.isTutorVerified ? "Verified" : "Not Verified"}
                                        </p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Blocked</p>
                                        <p className={`text-lg font-semibold ${tutor.isBlocked ? "text-red-400" : "text-green-400"}`}>
                                            {tutor.isBlocked ? "Yes" : "No"}
                                        </p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Email Verified</p>
                                        <p className={`text-lg font-semibold ${tutor.isEmailVerified ? "text-green-400" : "text-red-400"}`}>
                                            {tutor.isEmailVerified ? "Yes" : "No"}
                                        </p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Rating</p>
                                        <p className="text-lg">{tutor?.rating ? tutor?.rating : "N/A"}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Joined On</p>
                                        <p className="text-lg">{dayjs(tutor?.createdAt).format('DD MMM YYYY')}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Bio</p>
                                        <p className="text-lg">{tutor.bio || "No bio available"}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-gray-500 text-sm">Skills</p>
                                        <p className="text-lg">{tutor.skills.length > 0 ? tutor.skills.join(", ") : "No skills added"}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <p className="text-center text-red-500">Tutor not found</p>
                    )}
                </div>

                <h3 className="text-xl font-semibold mt-4">Courses by {tutor?.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-gray-700"
                    />

                    <Select onValueChange={(value) => setStatusFilter(value)} defaultValue="All">
                        <SelectTrigger className={`${isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900"}`}>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectContent className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                        </SelectPortal>
                    </Select>

                    <Select onValueChange={(value) => setSortOrder(value)} defaultValue="price-low">
                        <SelectTrigger className={`${isDark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900"}`}>
                            <SelectValue placeholder="Sort by price" />
                        </SelectTrigger>
                        <SelectPortal>
                            <SelectContent className={`${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                                <SelectItem value="price-low">Price: Low to high</SelectItem>
                                <SelectItem value="price-high">Price: High to low</SelectItem>
                            </SelectContent>
                        </SelectPortal>
                    </Select>
                </div>


                {paginatedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {paginatedCourses.map((course) => (
                            <Card
                                key={course._id}
                                className={`p-4 border rounded-lg shadow-md ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black'}`}>
                                <h4 className="text-lg font-medium">{course.title}</h4>
                                <p className="text-sm text-gray-400">{course?.category_id?.name}</p>
                                <p className="text-sm font-semibold mt-1">Price: ${course.price}</p>
                                <p className="text-sm font-semibold mt-1 flex">Rating: {course.rating} <StarIcon className="mt-0.5 ms-1" size={16} /></p>
                                <Button
                                    onClick={() => navigate(`/admin/categories/courses/${course._id}`)}
                                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5">
                                    View Course
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <NoData entity="courses" />
                )}
                <AdminPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );
};

export default TutorDetailPart;

const Loading = () => (
    <div className="flex justify-center items-center w-full py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
);
