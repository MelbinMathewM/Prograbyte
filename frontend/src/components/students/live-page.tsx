import { useContext, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useTheme } from "@/contexts/theme-context";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AtSign, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { CommentBank } from "@mui/icons-material";
import { liveSocket } from "@/configs/socketConfig";
import { UserContext } from "@/contexts/user-context";
import { SOCKET_EVENTS } from "@/configs/socketConfig";
import { FaEye } from "react-icons/fa";
import { getScheduleById } from "@/api/live";
import { ILiveClassSchedule } from "@/types/live";

const LivePart = () => {
    const [viewerCount, setViewerCount] = useState(0);
    const [schedule, setSchedule] = useState<ILiveClassSchedule | null>(null);
    const [comments, setComments] = useState<{ user: string; text: string }[]>([]);
    const [newComment, setNewComment] = useState("");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const { user } = useContext(UserContext) ?? {};
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";
    const navigate = useNavigate();
    const { schedule_id } = useParams();

    useEffect(() => {
        if(!schedule_id) return;
        const getSchedule = async () => {
            try{
                const response = await getScheduleById(schedule_id);
                console.log(response.schedule);
                setSchedule(response.schedule);
            }catch(err: any){
                console.error(err.error);
            }
        }
        getSchedule();
    },[schedule_id]);

    useEffect(() => {
        if(!schedule) return;

        if (videoRef.current) {
            if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {

                videoRef.current.src = schedule.meeting_link as string;

            } else if (Hls.isSupported()) {

                const hls = new Hls();
                hls.loadSource(schedule?.meeting_link as string);
                hls.attachMedia(videoRef.current);
                hlsRef.current = hls;
            }
        }

        if (liveSocket.connected) {
            liveSocket.emit(SOCKET_EVENTS.JOIN, schedule.room_id, user?.username);
        } else {
            liveSocket.on(SOCKET_EVENTS.CONNECT, () => {
                liveSocket.emit(SOCKET_EVENTS.JOIN, schedule.room_id);
            });
        }

        const handleComment = (comment: { user: string; text: string }) => {
            if (comment?.user && comment?.text) {
                setComments(prev => [...prev, comment]);
            }
        };

        const handleViewerCount = (count: number) => {
            console.log(count,'count');
            setViewerCount(count);
        };

        liveSocket.on(SOCKET_EVENTS.RECEIVE_COMMENT, handleComment);
        liveSocket.on(SOCKET_EVENTS.VIEW_COUNT, handleViewerCount);

        return () => {
            liveSocket.off(SOCKET_EVENTS.RECEIVE_COMMENT, handleComment);
            liveSocket.off(SOCKET_EVENTS.VIEW_COUNT, handleViewerCount);
            hlsRef.current?.destroy();
        };
    }, [schedule]);

    const handleSendComment = () => {
        if (!newComment.trim()) return;

        const commentData = { user: user?.username as string, text: newComment };

        liveSocket.emit(SOCKET_EVENTS.SEND_COMMENT, {
            roomId: schedule?.room_id,
            comment: commentData,
        });

        setNewComment("");
    };

    return (
        <div className={`min-h-screen space-y-6 p-4 ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            <nav className={`${isDark ? "bg-gray-800 text-gray-300" : "bg-violet-50 text-gray-500"} p-6 rounded mb-4 flex items-center`}>
                <Link to="/home" className="font-bold hover:text-blue-500">Home</Link>
                <ChevronRight size={16} />
                <Link to="/courses" className="font-bold hover:text-blue-500">Courses</Link>
                <ChevronRight size={16} />
                <span>live</span>
            </nav>

            <div className="flex w-full sm:mx-auto justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Live Streaming</h2>
                <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center shadow-md px-4 py-2 rounded-md font-bold transition ${isDark ? "text-red-400 hover:bg-red-500 hover:text-white" : "text-red-500 hover:bg-red-500 hover:text-white"}`}
                >
                    <ChevronLeft size={16} />
                    Back
                </button>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Section */}
                <div className="lg:col-span-2 relative">
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        playsInline
                        className={`w-full rounded-sm shadow-lg border ${ isDark? "border-gray-700": "border-gray-200"}`}
                    />
                    <div className="flex gap-2 absolute top-2 left-2 bg-black bg-opacity-60 px-3 py-1 rounded-sm text-sm text-white">
                        <FaEye className="mt-0.5"/> {viewerCount} watching
                    </div>
                </div>

                {/* Chat Section */}
                <div className={`rounded-sm p-3 shadow-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <h2 className="text-xl font-semibold mb-4"><CommentBank /> Ask Questions</h2>

                    <div className={`h-80 overflow-y-auto space-y-2 border rounded p-3 mb-2 ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"}`}>
                        {comments.length === 0 ? (
                            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                                No questions yet. Be the first to ask!
                            </p>
                        ) : (
                            comments.map((comment, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-1 ${isDark ? "text-gray-200" : "text-gray-800"} px-3 py-0.5 rounded shadow-lg`}
                                >
                                    <strong>
                                        <Link to={`/blog/profile/${comment?.user}`} className="inline-flex items-center font-semibold hover:text-blue-500">
                                            <AtSign className="w-4 h-4" />
                                            {comment?.user}:
                                        </Link>
                                    </strong>
                                    <span>{comment.text}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex gap-0">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendComment();
                            }}                            
                            placeholder="Type your question..."
                            className={`flex-1 px-4 py-1 rounded-sm focus:outline-none border ${isDark ? "text-white bg-gray-900 border-gray-700" : "text-black bg-white border-gray-300"}`}
                        />
                        <button
                            onClick={handleSendComment}
                            className={`border ${isDark ? "bg-gray-900 hover:bg-blue-500 text-white border-gray-700" : "bg-white text-blue-500 hover:text-white hover:bg-blue-500 border-gray-300" } px-4 py-1 rounded-sm font-semibold`}
                        >
                            <Send />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LivePart;
