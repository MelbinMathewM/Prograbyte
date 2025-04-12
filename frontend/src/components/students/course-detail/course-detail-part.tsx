import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import TabNav from "@/components/students/course-detail/course-detail-tabnav";
import { Course, EnrolledCourses } from "@/types/course";
import { fetchCourseDetail, fetchEnrolledCourse } from "@/api/course";
import { UserContext } from "@/contexts/user-context";
import { User } from "@/types/user";
import { getLiveSchedulesByCourse } from "@/api/live";
import dayjs from "dayjs";

const StudentCourseDetailPart = () => {

    const [course, setCourse] = useState<Course | null>(null);
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourses | null>(null);
    const [liveSessions, setLiveSessions] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const { user } = useContext(UserContext) ?? {};
    const { id } = useParams();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetchCourseDetail(id as string);
                setCourse(response.course);
            } catch (err: any) {
                console.error(err.response.data.error);
            }
        };
        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (!user?.id) return;
        const fetchEnrolled = async () => {
            try {
                const response = await fetchEnrolledCourse(user?.id);
                console.log(response, 'hii');

                const courseIds = response.enrolledCourses;

                setEnrolledCourses(courseIds);
            } catch (err) {
                console.error("error fetching enrolled courses")
            }
        }
        fetchEnrolled();
    }, [user?.id]);


    const enrolledCourse = enrolledCourses?.courses?.find((enrolled) => enrolled.courseId._id === course?._id);
    const isPurchased = !!enrolledCourse;

    useEffect(() => {
        if (!course) return;
        const getLiveSessions = async () => {
            try {
                const response = await getLiveSchedulesByCourse(course?._id as string);
                setLiveSessions(response.liveSchedules);
            } catch (err: any) {
                console.error(err.error);
            }
        };
        getLiveSessions();
    }, [course]);
    return (
        <div className={`${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"} mx-auto p-6`}>
            <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-violet-50 text-gray-500"} p-6 rounded mb-4 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">Courses</Link>
                <ChevronRight size={16} />
                <span>{course?.title}</span>
            </nav>

            <div className="flex w-full justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{course?.title}</h2>
                <Link to="/courses" className="flex shadow-md text-blue-500 font-bold px-4 py-2 rounded-md hover:text-white hover:bg-blue-400">
                    <ChevronLeft className="mt-1" size={16} />
                    Back
                </Link>
            </div>

            {course?.poster_url && course?.preview_video_urls && (
                <div className="grid md:grid-cols-2 mx-auto gap-6 mt-6">
                    {/* Left: Poster / Video Section */}
                    <div className="relative rounded-lg shadow-lg overflow-hidden cursor-pointer">
                        {showVideo ? (
                            <video
                                controls
                                autoPlay
                                className="w-full h-48 md:h-full rounded-lg"
                                onEnded={() => setShowVideo(false)}
                            >
                                <source src={course?.preview_video_urls?.[0]} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="relative w-full h-48 md:h-full rounded-lg overflow-hidden">
                                <img
                                    src={course?.poster_url}
                                    alt="Course Poster"
                                    className="w-full h-full object-cover rounded-lg transition-all duration-300 hover:brightness-75"
                                    onClick={() => setShowVideo(true)}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <button
                                        className="bg-black/60 p-4 rounded-full hover:bg-black/80 transition"
                                        onClick={() => setShowVideo(true)}
                                    >
                                        <PlayCircle size={48} className="text-white" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Live Class Info */}
                    <div
                        className={`rounded-2xl shadow-xl p-5 max-w-full md:max-w-[500px] w-full ${isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-blue-600">Live Class Sessions</h3>

                        {liveSessions?.length > 0 ? (
                            <div className="space-y-4">
                                {liveSessions.map((session: any, index: number) => {
                                    const sessionDate = new Date(session.date);
                                    const now = new Date();
                                    let status = session.status;
                                    if (now > sessionDate) {
                                        const diffMinutes = Math.floor((now.getTime() - sessionDate.getTime()) / 60000);
                                        status = diffMinutes < 90 ? "live" : "completed";
                                    }

                                    const statusStyles = {
                                        scheduled: "bg-yellow-100 text-yellow-800",
                                        live: "bg-red-100 text-red-600 animate-pulse",
                                        completed: "bg-gray-200 text-gray-500",
                                    };

                                    return (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-xl border border-gray-300 shadow-sm ${isDark ? "bg-gray-900" : "bg-white"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-lg">{session.title}</h4>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status as keyof typeof statusStyles]}`}
                                                >
                                                    {status}
                                                </span>
                                            </div>
                                            <p>{session.description}</p>
                                            <p className="text-sm mb-3">
                                                <strong>Date:</strong> {dayjs(session.scheduled_date).format("DD: MM: YYYY")}
                                            </p>

                                            {isPurchased ? (
                                                <Link
                                                    to={`/courses/live/${session._id}`}
                                                    className="inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                                >
                                                    Join Class
                                                </Link>
                                            ) : (
                                                <p className="text-sm italic text-gray-500">Purchase required to access class link</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No upcoming live sessions yet. Stay tuned!</p>
                        )}

                        {!isPurchased && (
                            <div className="mt-6 border-t pt-4">
                                <h4 className="text-lg font-semibold mb-2">Unlock Live Class Access</h4>
                                <p className="text-sm mb-3">
                                    Participate in interactive sessions, ask real-time questions, and collaborate with peers.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

            )}

            <TabNav course={course} enrolledCourses={enrolledCourses} user={user as User} isDark={isDark as boolean} />
        </div>
    );
};

export default StudentCourseDetailPart;
