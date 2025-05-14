import { useContext, useEffect, useState } from "react";
import { getTutorDashboardData } from "@/api/payments";
import { TutorContext } from "@/contexts/tutor-context";
import { fetchCourseDetail } from "@/api/course";
import { useTheme } from "@/contexts/theme-context";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { tutor } = useContext(TutorContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const [courseNames, setCourseNames] = useState<Record<string, string>>({});
    
    useEffect(() => {
        if (!tutor?.id) return;
        const fetchData = async () => {
            try {
                const data = await getTutorDashboardData(tutor?.id as string);
                setDashboardData(data.data);
            } catch (err: any) {
                setError(err?.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [tutor]);

    useEffect(() => {
        const fetchCourseNames = async () => {
            if (dashboardData?.topCourses.length) {
                const namesMap: Record<string, string> = {};
                for (const course of dashboardData.topCourses) {
                    try {
                        const response = await fetchCourseDetail(course.courseId);
                        namesMap[course.courseId] = response.course.title;
                    } catch (error) {
                        console.error("Error fetching course name", error);
                    }
                }
                setCourseNames(namesMap);
            }
        };
        fetchCourseNames();
    }, [dashboardData]);

    if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    const { totalRevenue, topCourses } = dashboardData;

    const containerClass = isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900";
    const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
    const textSecondary = isDark ? "text-gray-400" : "text-gray-600";

    return (
        <div className={`p-6 min-h-screen ${containerClass}`}>
            <h1 className="text-2xl font-semibold mb-4">Tutor Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className={`shadow-md rounded-xl p-4 border ${cardClass}`}>
                    <h2 className="text-lg font-medium">Total Earnings</h2>
                    <p className="text-2xl text-green-400 font-bold">
                        ₹{totalRevenue.totalTutorShare.toFixed(2)}
                    </p>
                </div>
                <div className={`shadow-md rounded-xl p-4 border ${cardClass}`}>
                    <h2 className="text-lg font-medium">Admin Share</h2>
                    <p className="text-xl text-blue-400">
                        ₹{totalRevenue.totalAdminShare.toFixed(2)}
                    </p>
                </div>
                <div className={`shadow-md rounded-xl p-4 border ${cardClass}`}>
                    <h2 className="text-lg font-medium">Total Revenue</h2>
                    <p className="text-xl text-yellow-400">
                        ₹{totalRevenue.totalAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className={`shadow-md rounded-xl p-4 border ${cardClass}`}>
                <h2 className="text-xl font-semibold mb-4">Top Courses</h2>
                {topCourses.length === 0 ? (
                    <p className={textSecondary}>No course sales yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {topCourses.map((course: any, index: number) => (
                            <li key={course.courseId} className="flex justify-between items-center border-b pb-2 last:border-none">
                                <div>
                                    <p className="font-medium">
                                        {courseNames[course.courseId] || `Course ID: ${course.courseId}`}
                                    </p>
                                    <p className={`text-sm ${textSecondary}`}>
                                        Earnings: ₹{course.totalTutorShare.toFixed(2)}
                                    </p>
                                </div>
                                <span className="text-blue-500 font-semibold">#{index + 1}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
