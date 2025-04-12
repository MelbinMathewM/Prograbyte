import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Hls from "hls.js";
import { changeLiveSchedule } from "@/api/live";
import { ChevronLeft, Send, Users, AtSign, ChevronRight } from "lucide-react";
import { liveSocket, SOCKET_EVENTS } from "@/configs/socketConfig";
import { FaEye } from "react-icons/fa";
import { useTheme } from "@/contexts/theme-context";
import { CallEnd } from "@mui/icons-material";

const LiveRoom: React.FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark-theme";

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const chatRef = useRef<HTMLDivElement | null>(null);

    const [comments, setComments] = useState<{ user: string; text: string }[]>([]);
    const [newComment, setNewComment] = useState("");
    const [viewerCount, setViewerCount] = useState(0);

    const streamUrl: string = location.state?.streamUrl;
    const streamKey: string = location.state?.streamKey;

    useEffect(() => {
        if (!streamUrl) return;

        if (videoRef.current) {
            if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
                videoRef.current.src = streamUrl;
            } else if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(videoRef.current);
                hlsRef.current = hls;
            }
        }

        return () => {
            hlsRef.current?.destroy();
        };
    }, [streamUrl]);

    useEffect(() => {
        const onReceiveComment = (comment: { user: string; text: string }) => {
            setComments(prev => [...prev, comment]);
        };

        const onViewerCount = (count: number) => {
            setViewerCount(count);
        };

        if (liveSocket.connected) {
            liveSocket.emit(SOCKET_EVENTS.JOIN, streamKey);
        } else {
            liveSocket.on(SOCKET_EVENTS.CONNECT, () => {
                liveSocket.emit(SOCKET_EVENTS.JOIN, streamKey);
            });
        }

        liveSocket.on(SOCKET_EVENTS.RECEIVE_COMMENT, onReceiveComment);
        liveSocket.on(SOCKET_EVENTS.VIEW_COUNT, onViewerCount);

        return () => {
            liveSocket.off(SOCKET_EVENTS.RECEIVE_COMMENT, onReceiveComment);
            liveSocket.off(SOCKET_EVENTS.VIEW_COUNT, onViewerCount);
            liveSocket.off(SOCKET_EVENTS.CONNECT);
        };
    }, [streamKey]);

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [comments]);

    const handleSendComment = () => {
        if (!newComment.trim()) return;

        const comment = { user: "Tutor", text: newComment };

        liveSocket.emit(SOCKET_EVENTS.SEND_COMMENT, {
            roomId: streamKey,
            comment
        });

        setNewComment("");
    };

    const endStream = async () => {
        try {
            await changeLiveSchedule(id as string, "completed");
            alert("Live stream ended.");
            navigate("/tutor/live");
        } catch (error) {
            console.error(error);
            alert("Failed to end the stream.");
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? "bg-gradient-to-br from-gray-950 to-gray-900 text-white" : "bg-gray-100 text-black"} p-4`}>
            {/* Breadcrumb Navigation */}
            <nav className="mb-4 text-sm flex items-center text-gray-500">
                <Link to="/tutor/dashboard" className="hover:text-blue-500">Dashboard</Link>
                <ChevronRight size={16} />
                <Link to="/tutor/live" className="hover:text-blue-500">Live</Link>
                <ChevronRight size={16} />
                <span>live room</span>
            </nav>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Live Room</h2>
                <Link to="/tutor/courses" className="flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    <ChevronLeft className="mt-1" size={18} /> Back
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Video Section */}
                <div className="md:col-span-2 relative">
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        playsInline
                        className={`w-full rounded-sm shadow-xl border ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    />
                    <div className={`flex gap-2 absolute top-2 left-2 px-3 py-1 rounded-sm text-sm shadow-sm ${isDark ? "bg-black bg-opacity-60 text-white" : "bg-white bg-opacity-70 text-black"
                        }`}>
                        <FaEye className="mt-0.5" /> {viewerCount} watching
                    </div>
                </div>

                {/* Chat Section */}

                <div className={`rounded-sm p-4 shadow-lg flex flex-col ${isDark ? "bg-gray-800" : "bg-white"}`}>
                    {/* Top Button */}
                    <div className="flex justify-between mb-4">
                        <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? "text-gray-100" : "text-gray-800"
                            }`}>
                            <Users size={20} /> Live Chat
                        </h2>
                        <button
                            onClick={endStream}
                            className={`px-4 py-2 rounded-sm font-medium shadow-md ${isDark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                                }`}
                        >
                            <CallEnd className="me-2"/>End stream
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatRef}
                        className={`flex-1 overflow-y-auto rounded-sm p-3 space-y-2 mb-4 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
                            }`}
                        style={{ maxHeight: "60vh" }}
                    >
                        {comments.length === 0 ? (
                            <p className={isDark ? "text-gray-400" : "text-gray-500"}>No messages yet.</p>
                        ) : (
                            comments.map((comment, idx) => (
                                <div
                                    key={idx}
                                    className={`w-fit max-w-[80%] px-3 py-1 rounded-xl shadow-md text-sm flex items-center gap-1 ${comment.user === "Tutor"
                                        ? isDark
                                            ? "bg-blue-600 text-white ml-auto"
                                            : "bg-blue-500 text-white ml-auto"
                                        : isDark
                                            ? "bg-gray-700 text-gray-300"
                                            : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    <strong className="inline-flex items-center">
                                        <AtSign className="w-4 h-4" /> {comment.user}
                                    </strong>
                                    : {comment.text}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                            placeholder="Write a message..."
                            className={`flex-1 px-4 py-2 rounded-l-md focus:outline-none border ${isDark
                                ? "text-white bg-gray-900 border-gray-700 placeholder-gray-500"
                                : "text-black bg-white border-gray-300 placeholder-gray-400"
                                }`}
                        />
                        <button
                            onClick={handleSendComment}
                            className={`px-4 py-2 rounded-r-md shadow-md ${isDark
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveRoom;