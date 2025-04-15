import { IStreamController } from "../../controllers/interfaces/IStream.controller";
import { Request, Response, NextFunction } from "express";
import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import fs from "fs";
import path from "path";
import logger from "@/utils/logger.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";

export class StreamController implements IStreamController {
    private ffmpegProcesses: Map<string, ChildProcessWithoutNullStreams> = new Map();

    constructor() { }

    async startStream(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule_id } = req.body;
    
            logger.info("Starting Stream...");
    
            const streamKey = `live_${schedule_id}`;
            const hlsDirectory = path.resolve(__dirname, "../../../hls", streamKey);
            const hlsPlaylistPath = path.join(hlsDirectory, "index.m3u8");
            const hlsUrl = `http://localhost:8080/hls/${streamKey}/index.m3u8`;
    
            if (!fs.existsSync(hlsDirectory)) {
                fs.mkdirSync(hlsDirectory, { recursive: true });
            }
    
            const ffmpegCmd = [
                "-loglevel", "warning",
                "-rtbufsize", "150M",
                "-f", "dshow",
                "-video_size", "1280x720",
                "-framerate", "10",
                "-pixel_format", "yuyv422",
                "-i", "video=Integrated Camera",
                "-f", "dshow",
                "-i", "audio=Microphone Array (Realtek High Definition Audio)",
                "-c:v", "libx264",
                "-preset", "ultrafast",
                "-tune", "zerolatency",
                "-g", "20",
                "-sc_threshold", "0",
                "-c:a", "aac",
                "-ar", "44100",
                "-b:a", "128k",
                "-f", "hls",
                "-hls_time", "2",
                "-hls_list_size", "6",
                "-hls_flags", "delete_segments",
                "-hls_allow_cache", "0",
                "-hls_segment_type", "mpegts",
                hlsPlaylistPath
            ];
    
            const ffmpegProcess = spawn("ffmpeg", ffmpegCmd);
    
            this.ffmpegProcesses.set(schedule_id, ffmpegProcess);
    
            ffmpegProcess.stderr.on("data", (data) => {
                logger.error(`FFmpeg Log: ${data.toString()}`);
            });
            
            ffmpegProcess.on("close", (code) => {
                logger.info(`FFmpeg exited with code ${code}`);
                this.ffmpegProcesses.delete(schedule_id);
            });
            
    
            res.json({
                success: true,
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
    
            logger.info(`Stopping Stream for schedule_id: ${schedule_id}`);
    
            const ffmpegProcess = this.ffmpegProcesses.get(schedule_id);
            if (!ffmpegProcess) {
                res.status(400).json({ success: false, error: HttpResponse.STREAM_NOT_FOUND });
                return;
            }
    
            const pid = ffmpegProcess.pid;
            if (pid) {
                logger.warn(`Killing FFmpeg process with PID: ${pid}`);
    
                exec(`taskkill /PID ${pid} /T /F`, (error, stdout, stderr) => {
                    if (error) {
                        logger.error(`Error killing process: ${error.message}`);
                    } else {
                        logger.info(`FFmpeg process stopped: ${stdout}`);
                    }
                });
    
                this.ffmpegProcesses.delete(schedule_id);
                res.status(HttpStatus.OK).json({ success: true, message: HttpResponse.STREAM_STOPPED });
            } else {
                logger.error("No PID found for FFmpeg process.");
                res.status(500).json({ success: false, error: HttpResponse.STREAM_STOP_ERROR });
            }
        } catch (err) {
            next(err);
        }
    }    
}
