import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { fetchToken, getSecureUrl } from "../../api/video";
import { toast } from "react-toastify";

interface VideoPlayerProps {
    publicId: string;
    isDark: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ publicId, isDark }) => {
    const [token, setToken] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const BASE_URL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        if (!publicId) return;

        const fetchVideoToken = async () => {
            try {
                const response = await fetchToken(publicId);
                setToken(response.token);
            } catch (error: any) {
                const backendMessage = error.response?.data?.error || "An error occurred";
                toast.error(backendMessage);
            }
        };

        fetchVideoToken();
    }, [publicId]);

    useEffect(() => {
        if (!token) return;

        const fetchSecureVideoUrl = async () => {
            try {
                const response = await getSecureUrl(token);
                console.log(response,'ll')
                setVideoUrl(`${BASE_URL}${response.videoUrl}`);
                console.log(`${BASE_URL}${response.videoUrl}`)
            } catch (error: any) {
                const backendMessage = error.response?.data?.error || "An error occurred";
                toast.error(backendMessage);
            }
        };

        fetchSecureVideoUrl();
    }, [token]);

    return (
        <div className="flex justify-center items-center pt-3">
            <div className={`w-full max-w-3xl mx-auto border-b rounded shadow-lg ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                {videoUrl ? (
                    <ReactPlayer
                        url={videoUrl}
                        controls
                        width="100%"
                        height="100%"
                        playing={true}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: "nodownload",
                                },
                            },
                        }}
                    />
                ) : (
                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>Loading video...</p>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
