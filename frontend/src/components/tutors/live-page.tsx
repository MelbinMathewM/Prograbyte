import { useContext, useEffect, useState } from "react";
import { getLiveSchedulesByTutor, checkLiveStart, changeLiveSchedule } from "@/api/live";
import { TutorContext } from "@/contexts/tutor-context";
import { ILiveClassSchedule } from "@/types/live";
import { ChevronRight, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LivePart = () => {
    const [liveSchedules, setLiveSchedules] = useState<ILiveClassSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const { tutor } = useContext(TutorContext) ?? {};
    const [activeTab, setActiveTab] = useState("scheduled");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLiveSchedules = async () => {
            try {
                if (!tutor?.id) return;
                const response = await getLiveSchedulesByTutor(tutor?.id);
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
            setLiveSchedules(prev => prev.map(schedule =>
                schedule._id === scheduleId ? { ...schedule, status: "canceled" } : schedule
            ));
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

                if(!streamResponse.ok) toast.error("Failed to start stream");
                navigate(`/tutor/live/${scheduleId}`);
            } else {
                toast.error("You cannot start the live class yet.");
            }
        } catch (error) {
            console.error("Error starting live class:", error);
            toast.error("Failed to check live class timing.");
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading live schedules...</p>;

    const filteredSchedules = liveSchedules.filter(schedule => schedule.status === activeTab);

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <nav className="mb-4 text-sm flex items-center text-gray-600">
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <span className="font-semibold">Live Classes</span>
            </nav>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Live Classes</h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-4">
                {["scheduled", "live", "canceled"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium ${activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {filteredSchedules.length === 0 ? (
                <p className="text-center text-gray-500">No {activeTab} live classes found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm">
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Duration</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule) => (
                                <tr key={schedule._id} className="border-t text-gray-700 hover:bg-gray-50">
                                    <td className="p-3">{schedule.title}</td>
                                    <td className="p-3">{new Date(schedule.scheduled_date).toLocaleString()}</td>
                                    <td className="p-3">{schedule.duration} min</td>
                                    <td className="p-3 flex items-center gap-3">
                                        {schedule.status === "scheduled" && (
                                            <>
                                                <button
                                                    onClick={() => handleStartLive(schedule._id as string)}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    Start
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(schedule._id as string)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        {schedule.status !== "scheduled" && <span className="text-gray-400">N/A</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LivePart;
