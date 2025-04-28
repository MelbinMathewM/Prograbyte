import { useContext, useEffect, useState } from "react";
import { getLiveSchedulesByTutor, checkLiveStart, changeLiveSchedule } from "@/api/live";
import { TutorContext } from "@/contexts/tutor-context";
import { ILiveClassSchedule } from "@/types/live";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BreadcrumbHeader from "./breadcrumb";
import { useTheme } from "@/contexts/theme-context";

const ITEMS_PER_PAGE = 5;

const LivePart = () => {
    const [liveSchedules, setLiveSchedules] = useState<ILiveClassSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const { tutor } = useContext(TutorContext) ?? {};
    const [activeTab, setActiveTab] = useState("scheduled");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    useEffect(() => {
        const fetchLiveSchedules = async () => {
            try {
                if (!tutor?.id) return;
                const response = await getLiveSchedulesByTutor(tutor.id);
                setLiveSchedules(response.liveSchedules);
            } catch (error) {
                console.error("Error fetching live schedules:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveSchedules();
    }, [tutor?.id]);

    const handleCancel = async (scheduleId: string) => {
        if (!window.confirm("Are you sure you want to cancel this live class?")) return;
        try {
            await changeLiveSchedule(scheduleId, "canceled");
            setLiveSchedules(prev =>
                prev.map(schedule =>
                    schedule._id === scheduleId ? { ...schedule, status: "canceled" } : schedule
                )
            );
            toast.success("Live class canceled successfully");
        } catch (error) {
            console.error("Error canceling live class:", error);
            toast.error("Failed to cancel the live class");
        }
    };

    const handleStartLive = async (scheduleId: string) => {
        try {
            const response = await checkLiveStart(scheduleId);
            if (response.canStart) {
                const streamResponse = await changeLiveSchedule(scheduleId, "live");

                if (!streamResponse.ok) toast.error("Failed to start stream");
                navigate(`/tutor/live/${scheduleId}`);
            } else {
                toast.error("You cannot start the live class yet.");
            }
        } catch (error) {
            console.error("Error starting live class:", error);
            toast.error("Failed to check live class timing.");
        }
    };

    const filteredSchedules = liveSchedules.filter(schedule => schedule.status === activeTab);

    // Pagination Logic
    const totalPages = Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE);
    const paginatedSchedules = filteredSchedules.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) return <p className="text-center text-gray-500">Loading live schedules...</p>;

    return (
        <div className={`p-6 rounded-lg shadow ${isDark ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"}`}>
            <BreadcrumbHeader
                paths={[
                    { label: "Dashboard", href: "/tutor/dashboard" },
                    { label: "Live" }
                ]}
                title="Live Classes"
            />

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-6">
                {["scheduled", "live", "canceled"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setActiveTab(tab);
                            setCurrentPage(1);
                        }}
                        className={`px-4 py-2 font-semibold capitalize ${
                            activeTab === tab
                                ? "border-b-2 border-blue-500 text-blue-500"
                                : "text-gray-500 hover:text-blue-400"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {paginatedSchedules.length === 0 ? (
                <p className="text-center text-gray-400">No {activeTab} live classes found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full rounded-lg overflow-hidden">
                        <thead>
                            <tr className={`${isDark ? "bg-gray-700" : "bg-gray-100"} text-sm`}>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Duration</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSchedules.map(schedule => (
                                <tr
                                    key={schedule._id}
                                    className={`border-t ${isDark ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-200"}`}
                                >
                                    <td className="p-3">{schedule.title}</td>
                                    <td className="p-3">{new Date(schedule.scheduled_date).toLocaleString()}</td>
                                    <td className="p-3">{schedule.duration} min</td>
                                    <td className="p-3 flex items-center gap-3">
                                        {schedule.status === "scheduled" ? (
                                            <>
                                                <button
                                                    onClick={() => handleStartLive(schedule._id as string)}
                                                    className="text-blue-500 hover:underline font-semibold"
                                                >
                                                    Start
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(schedule._id as string)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600"
                    >
                        Previous
                    </button>
                    <span className="font-medium">{currentPage} / {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default LivePart;
