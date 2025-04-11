import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { changeLiveSchedule } from "@/api/live";

interface Comment {
    user: string;
    text: string;
}

const LiveRoom: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const streamUrl: string | undefined = location.state?.streamUrl;
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const chatRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!streamUrl) {
            console.error("No stream URL found, redirecting...");
            // navigate("/tutor/live");
            return;
        }

        if (videoRef.current) {
            if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
                videoRef.current.src = streamUrl;
                videoRef.current.load();
            } else if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(streamUrl);
                hls.attachMedia(videoRef.current);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log("HLS manifest loaded, starting playback...");
                    videoRef.current?.play();
                });

                hls.on(Hls.Events.ERROR, (_, data) => {
                    console.error("HLS.js error:", data);
                });

                hlsRef.current = hls;
            }
        }
    }, [streamUrl, navigate]);

    useEffect(() => {
        // Auto-scroll to the latest comment
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [comments]);

    // Function to end the live stream
    const endStream = async () => {
        try {
            await changeLiveSchedule(id as string, "completed");
            alert("Live stream ended successfully!");
            navigate("/tutor/live");
        } catch (error) {
            console.error("Error ending stream:", error);
            alert("Failed to end the stream.");
        }
    };

    // Function to send a comment
    const sendComment = () => {
        if (!newComment.trim()) return;
        setComments([...comments, { user: "Tutor", text: newComment }]);
        setNewComment("");
    };

    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-900 text-white">
            {/* Video Section */}
            <div className="md:w-2/3 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-2">Live Streaming</h1>
                
                <div className="relative w-full max-w-3xl">
                    <video ref={videoRef} controls autoPlay playsInline className="w-full rounded-lg shadow-lg"></video>
                </div>

                <div className="flex gap-4 mt-4">
                    <button 
                        onClick={() => {
                            if (streamUrl) {
                                navigator.clipboard.writeText(streamUrl);
                                alert("HLS URL copied to clipboard!");
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
                    >
                        Copy HLS URL
                    </button>

                    <button 
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow-md"
                        onClick={endStream}
                    >
                        End Stream
                    </button>
                </div>
            </div>

            {/* Chat Section */}
            <div className="md:w-1/3 flex flex-col border-l border-gray-700 p-4">
                <h2 className="text-xl font-semibold mb-2">Live Chat</h2>

                {/* Chat Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-800 rounded-lg shadow-inner h-[60vh]">
                    {comments.map((comment, index) => (
                        <div key={index} className={`p-2 rounded-md ${comment.user === "Tutor" ? "bg-blue-600 text-white self-end" : "bg-gray-700 text-gray-300"}`}>
                            <strong>{comment.user}:</strong> {comment.text}
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="flex mt-2">
                    <input 
                        type="text" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Write a comment..."
                        className="flex-1 p-2 text-black rounded-l-md focus:outline-none"
                    />
                    <button 
                        onClick={sendComment} 
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-r-md shadow-md"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveRoom;
