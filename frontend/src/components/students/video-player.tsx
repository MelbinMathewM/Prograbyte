import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { fetchToken, getSecureUrl } from "../../api/video";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { VideoPlayerProps } from "../../types/user";

type VideoJsPlayer = ReturnType<typeof videojs>;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ publicId, isDark }) => {
    const [token, setToken] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<VideoJsPlayer | null>(null);
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
                setVideoUrl(`${BASE_URL}${response.videoUrl}`);
            } catch (error: any) {
                const backendMessage = error.response?.data?.error || "An error occurred";
                toast.error(backendMessage);
            }
        };

        fetchSecureVideoUrl();
    }, [token]);

    useEffect(() => {
        if (!videoUrl || !videoRef.current) return;

        const accessToken = Cookies.get("accessToken");
        console.log(accessToken,"nn")

        playerRef.current = videojs(videoRef.current, {
            controls: true,
            autoplay: true,
            preload: "auto",
            fluid: true,
            playbackRates: [0.5, 1, 1.25, 1.5, 2], // ✅ Playback speed options
            html5: {
                hls: {
                    withCredentials: true,
                },
                xhr: {
                    beforeSend: function (xhr: XMLHttpRequest) {
                        if (accessToken) {
                            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
                        }
                    },
                },
            },
            sources: [
                {
                    src: videoUrl,
                    type: "video/mp4",
                },
            ],
        });

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose();
            }
        };
    }, [videoUrl]);

    return (
        <div className="flex justify-center items-center pt-3">
            <div className={`w-full max-w-3xl mx-auto border-b rounded shadow-lg ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        className="video-js vjs-big-play-centered"
                        controls
                        crossOrigin="anonymous"
                        playsInline
                    />
                ) : (
                    <p className={`${isDark ? "text-gray-400" : "text-gray-500"} text-center`}>Loading video...</p>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
