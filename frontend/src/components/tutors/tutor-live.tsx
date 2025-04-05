import { useLocation } from "react-router-dom";

const LiveRoom = () => {
    const location = useLocation();
    const streamUrl = location.state?.streamUrl || "rtmp://default-url";

    return (
        <div>
            <h1>Live Streaming</h1>
            <p>RTMP Stream URL: {streamUrl}</p>
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(streamUrl);
                    alert("RTMP URL copied to clipboard!");
                }}
            >
                Copy RTMP URL
            </button>
        </div>
    );
};

export default LiveRoom;
