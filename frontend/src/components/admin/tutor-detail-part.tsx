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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import NoData from "../ui/no-data";
import { SelectPortal } from "@radix-ui/react-select";
import LoadingSkeletonCards from "../ui/loading-skeleton";

const TutorDetailPart = () => {
    const [tutor, setTutor] = useState<Profile | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("price-low");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

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
            console.error("Failed to fetch tutor details");
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
            console.error("Failed to fetch courses");
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
        <div className={`min-h-screen p-6 ${isDark ? "bg-black/99 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-6xl mx-auto flex flex-col gap-8">
                {/* Breadcrumb */}
                <nav className="text-sm flex items-center gap-2 text-gray-500">
                    <Link to="/admin/dashboard" className="hover:text-blue-500 transition font-medium">Dashboard</Link>
                    <ChevronRight size={16} />
                    <Link to="/admin/tutors" className="hover:text-blue-500 transition font-medium">Tutors</Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-500 font-semibold">{tutor?.name || "Loading..."}</span>
                </nav>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                    <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-foreground"}`}>Tutor Details</h2>
                    <Link
                        to="/admin/tutors"
                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 text-sm rounded-sm hover:bg-blue-700"
                    >
                        <ChevronLeft size={16} /> Back
                    </Link>
                </div>

                {/* Tutor Info */}
                <div className="flex justify-center w-full">
                    {loading ? (
                        <LoadingSkeletonCards />
                    ) : tutor ? (
                        <Card className={`w-full shadow-lg border rounded-sm transition-all duration-300 
                            ${isDark ? "bg-gray-950 border-gray-700" : "bg-white border-gray-200"}`}>
                            <CardHeader className="border-b px-6 py-4">
                                <CardTitle className="text-2xl font-bold text-blue-400">{tutor.name}</CardTitle>
                                <p className="text-sm text-gray-400 mt-1">@{tutor.username}</p>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 py-6">
                                {[
                                    ["Email", tutor.email],
                                    ["Status", tutor.isTutorVerified ? "Verified" : "Not Verified", tutor.isTutorVerified ? "text-green-400" : "text-red-400"],
                                    ["Blocked", tutor.isBlocked ? "Yes" : "No", tutor.isBlocked ? "text-red-400" : "text-green-400"],
                                    ["Email Verified", tutor.isEmailVerified ? "Yes" : "No", tutor.isEmailVerified ? "text-green-400" : "text-red-400"],
                                    ["Rating", tutor.rating || "N/A"],
                                    ["Joined On", dayjs(tutor?.createdAt).format("DD MMM YYYY")],
                                    ["Bio", tutor.bio || "No bio available"],
                                    ["Skills", tutor.skills.length ? tutor.skills.join(", ") : "No skills added"],
                                ].map(([label, value, color], idx) => (
                                    <div key={idx}>
                                        <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
                                        <p className={`text-base font-medium ${color || ""} ${isDark ? "text-white" : "text-black"}`}>{value}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                        <p className="text-center text-red-500 font-medium">Tutor not found</p>
                    )}
                </div>

                {/* Courses Section */}
                <div className="space-y-4">
                    <h3 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-black"}`}>Courses by {tutor?.name}</h3>

                    {/* Filter and Search */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`rounded-md shadow-sm ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-white border-gray-300"}`}
                        />

                        <Select onValueChange={setStatusFilter} defaultValue="All">
                            <SelectTrigger className={`rounded-md shadow-sm ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-white border-gray-300"}`}>
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

                        <Select onValueChange={setSortOrder} defaultValue="price-low">
                            <SelectTrigger className={`rounded-md shadow-sm ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-white border-gray-300"}`}>
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

                    {/* Course Cards */}
                    {paginatedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {paginatedCourses.map(course => (
                                <Card key={course._id} className={`p-4 rounded-sm shadow-md hover:shadow-lg transition-all border
                                    ${isDark ? "bg-gray-950 text-white border-gray-700" : "bg-white text-gray-900 border border-gray-200"}`}>
                                    <h4 className="text-lg font-semibold">{course.title}</h4>
                                    <p className="text-sm text-gray-400">{course.category_id?.name}</p>
                                    <p className="text-sm mt-1">Price: <span className="font-semibold">${course.price}</span></p>
                                    <p className="text-sm mt-1 flex items-center">
                                        Rating: {course.rating}
                                        <StarIcon size={16} className="ml-1 text-yellow-400" />
                                    </p>
                                    <Button
                                        onClick={() => navigate(`/admin/categories/courses/${course._id}`)}
                                        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-md transition"
                                    >
                                        View Course
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <NoData entity="courses" />
                    )}
                </div>

                <AdminPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    );

};

export default TutorDetailPart;
