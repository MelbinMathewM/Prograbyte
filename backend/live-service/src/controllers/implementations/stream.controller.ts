import { IStreamController } from "@/controllers/interfaces/IStream.controller";
import { Request, Response, NextFunction } from "express";
import { exec } from "child_process";
export class StreamController implements IStreamController {
    constructor(){ }

    async startStream(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { schedule_id } = req.body;

            console.log('hii')

            const streamKey = `live_${schedule_id}`;
            const streamUrl = `rtmp://localhost:1935/live/${streamKey}`;

            const ffmpegCmd = `ffmpeg -rtbufsize 100M -f dshow -video_size 1280x720 -framerate 10 -pixel_format yuyv422 -i video="Integrated Camera" -f dshow -i audio="Microphone Array (Realtek High Definition Audio)" -acodec aac -b:a 128k -ar 44100 -f flv ${streamUrl}`
            exec(ffmpegCmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`FFmpeg Error: ${error.message}`);
                    return res.status(500).json({ success: false, error: "Failed to start stream" });
                }
                console.log(streamUrl);
                res.json({ success: true, url: streamUrl });
            });

        }catch(err){
            next(err);
        }
    }
}