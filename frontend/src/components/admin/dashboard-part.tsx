import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getDashboardData } from "@/api/payments";
import { fetchCourseDetail } from "@/api/course";
import { useTheme } from "@/contexts/theme-context";

interface DashboardData {
    topTutors: {
        tutorId: string;
        tutorName: string;
        totalEarnings: number;
    }[];
    topCourses: {
        courseId: string;
        courseName: string;
        totalRevenue: number;
    }[];
    totalRevenue: {
        totalAmount: number;
        totalAdminShare: number;
        totalTutorShare: number;
    };
}

const DashboardPart = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [courseNames, setCourseNames] = useState<Record<string, string>>({});
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getDashboardData();
                setData(response);
            } catch (err: any) {
                setError(err?.error || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const fetchCourseNames = async () => {
            if (data?.topCourses.length) {
                const namesMap: Record<string, string> = {};
                for (const course of data.topCourses) {
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
    }, [data]);

    const renderTopCourses = () => {
        if (loading) return <li>Loading...</li>;
        if (error) return <li className="text-red-500">{error}</li>;
        if (!data?.topCourses.length) return <li>No courses available</li>;

        return data.topCourses.map((course) => (
            <li key={course.courseId}>
                📚 {courseNames[course.courseId] || course.courseId} — <span className="font-medium">${course.totalRevenue.toFixed(2)}</span>
            </li>
        ));
    };

    const renderTopTutors = () => {
        if (loading) return <li>Loading...</li>;
        if (error) return <li className="text-red-500">{error}</li>;
        if (!data?.topTutors.length) return <li>No tutors available</li>;

        return data.topTutors.map((tutor) => (
            <li key={tutor.tutorId}>
                🧑‍🏫 {tutor.tutorName} — <span className="font-medium">${tutor.totalEarnings.toFixed(2)}</span>
            </li>
        ));
    };

    const revenueChartData = [
        { name: "Total Revenue", value: data?.totalRevenue.totalAmount || 0 },
        { name: "Admin Share", value: data?.totalRevenue.totalAdminShare || 0 },
        { name: "Tutor Share", value: data?.totalRevenue.totalTutorShare || 0 },
    ];

    return (
        <div className={`p-6 space-y-6 ${isDark ? "bg-black" : "bg-white"}`}>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {/* Top Courses */}
                <Card className={`${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <CardContent className="p-4">
                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            Top Courses
                        </h3>
                        <ul className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {renderTopCourses()}
                        </ul>
                    </CardContent>
                </Card>

                {/* Top Tutors */}
                <Card className={`${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <CardContent className="p-4">
                        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            Top Tutors
                        </h3>
                        <ul className={`space-y-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            {renderTopTutors()}
                        </ul>
                    </CardContent>
                </Card>

                {/* Revenue Analytics */}
                <Card className={`col-span-1 md:col-span-2 xl:col-span-3 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    <CardContent className="p-4">
                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            Analytics Overview
                        </h3>
                        {loading ? (
                            <p>Loading chart...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueChartData}>
                                    <CartesianGrid 
                                        strokeDasharray="3 3" 
                                        stroke={isDark ? "#4B5563" : "#E5E7EB"} 
                                    />
                                    <XAxis 
                                        dataKey="name" 
                                        stroke={isDark ? "#D1D5DB" : "#374151"} 
                                    />
                                    <YAxis 
                                        stroke={isDark ? "#D1D5DB" : "#374151"} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: isDark ? "#1F2937" : "#ffffff", 
                                            borderColor: isDark ? "#374151" : "#E5E7EB",
                                            color: isDark ? "#D1D5DB" : "#374151"
                                        }}
                                    />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#3b82f6" 
                                        radius={[10, 10, 0, 0]} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default DashboardPart;
