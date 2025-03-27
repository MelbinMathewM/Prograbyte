import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const TutorLive = () => {
    const {id} = useParams();
    console.log(id,'jj')
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        startCamera();

        socket.emit("join-room", id);

        return () => {
            stream?.getTracks().forEach(track => track.stop());
            socket.disconnect();
        };
    }, []);

    const startStreaming = async () => {
        setIsStreaming(true);

        peerRef.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        stream?.getTracks().forEach(track => peerRef.current?.addTrack(track, stream));

        peerRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { id, candidate: event.candidate });
            }
        };

        const offer = await peerRef.current.createOffer();
        await peerRef.current.setLocalDescription(offer);

        socket.emit("offer", { id, offer });

        console.log("Streaming started...");
    };

    socket.on("answer", async (answer) => {
        if (peerRef.current) {
            await peerRef.current.setRemoteDescription(answer);
        }
    });

    socket.on("ice-candidate", async (candidate) => {
        if (peerRef.current) {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });

    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Streaming</h2>

            <video ref={videoRef} autoPlay className="w-full max-w-lg border rounded-lg" />

            <div className="mt-4">
                {!isStreaming ? (
                    <button onClick={startStreaming} className="px-4 py-2 bg-green-600 text-white rounded-md">Start Streaming</button>
                ) : (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md">Streaming Live...</button>
                )}
            </div>
        </div>
    );
};

export default TutorLive;
