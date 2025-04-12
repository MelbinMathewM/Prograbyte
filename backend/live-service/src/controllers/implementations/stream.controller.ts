import { IStreamController } from "../../controllers/interfaces/IStream.controller";
import { Request, Response, NextFunction } from "express";
import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import fs from "fs";
import path from "path";

export class StreamController implements IStreamController {
    private ffmpegProcesses: Map<string, ChildProcessWithoutNullStreams> = new Map();

    constructor() { }

    async startStream(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule_id } = req.body;

            console.log("Starting Stream...");

            const streamKey = `live_${schedule_id}`;
            const rtmpUrl = `rtmp://localhost:1935/stream/${streamKey}`;
            const hlsDirectory = path.resolve("C:\\Users\\User\\Coding Items\\Second-project\\backend\\live-service\\hls", streamKey);
            const hlsUrl = `http://localhost:8080/hls/${streamKey}.m3u8`;

            if (!fs.existsSync(hlsDirectory)) {
                fs.mkdirSync(hlsDirectory, { recursive: true });
            }

            // FFmpeg command
            const ffmpegCmd = [
                "-rtbufsize", "100M",
                "-f", "dshow",
                "-video_size", "1280x720",
                "-framerate", "10",
                "-pixel_format", "yuyv422",
                "-i", "video=Integrated Camera",
                "-f", "dshow",
                "-i", "audio=Microphone Array (Realtek High Definition Audio)",
                "-acodec", "aac",
                "-b:a", "128k",
                "-ar", "44100",
                "-f", "flv",
                `${rtmpUrl}`
            ];

            const ffmpegProcess = spawn("ffmpeg", ffmpegCmd);

            this.ffmpegProcesses.set(schedule_id, ffmpegProcess); // Store the process

            ffmpegProcess.stdout.on("data", (data) => console.log(`FFmpeg Output: ${data}`));
            ffmpegProcess.stderr.on("data", (data) => console.error(`FFmpeg Error: ${data.toString()}`));
            ffmpegProcess.on("close", (code) => {
                console.log(`FFmpeg process exited with code ${code}`);
                this.ffmpegProcesses.delete(schedule_id); // Remove from the map on exit
            });

            res.json({
                success: true,
                rtmpUrl,
                hlsUrl,
                streamKey
            });

        } catch (err) {
            next(err);
        }
    }

    async stopStream(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule_id } = req.body;
    
            console.log(`Stopping Stream for schedule_id: ${schedule_id}`);
    
            const ffmpegProcess = this.ffmpegProcesses.get(schedule_id);
            if (!ffmpegProcess) {
                res.status(400).json({ success: false, error: "No active stream found" });
                return;
            }
    
            const pid = ffmpegProcess.pid;
            if (pid) {
                console.log(`Killing FFmpeg process with PID: ${pid}`);
    
                // Kill the process and all its children
                exec(`taskkill /PID ${pid} /T /F`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error killing process: ${error.message}`);
                    } else {
                        console.log(`FFmpeg process stopped: ${stdout}`);
                    }
                });
    
                // Ensure no FFmpeg processes remain
                exec("taskkill /IM ffmpeg.exe /F", (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error force-killing FFmpeg: ${error.message}`);
                    } else {
                        console.log("All FFmpeg processes terminated.");
                    }
                });
    
                this.ffmpegProcesses.delete(schedule_id);
                res.json({ success: true, message: "Stream stopped successfully" });
            } else {
                console.error("No PID found for FFmpeg process.");
                res.status(500).json({ success: false, error: "Failed to stop stream" });
            }
        } catch (err) {
            next(err);
        }
    }    
}
