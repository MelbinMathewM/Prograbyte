import { ChildProcessWithoutNullStreams, exec } from "child_process";
import { buildFfmpegCommand, createHlsDirectory, getHlsPlaylistPath, killFfmpegProcess, spawnFfmpeg } from "@/utils/ffmpeg.util";
import { FFmpegConfig } from "@/configs/ffmpeg.config";
import logger from "@/utils/logger.util";
import { IStreamService } from "../interfaces/IStream.service";
import { injectable } from "inversify";

@injectable()
export class StreamService implements IStreamService {
    private processes: Map<string, ChildProcessWithoutNullStreams> = new Map();

    async startStream(scheduleId: string): Promise<{ process: ChildProcessWithoutNullStreams, streamKey: string, hlsUrl: string }> {
        const streamKey = `live_${scheduleId}`;
        const hlsDirectory = createHlsDirectory(streamKey);
        const playlistPath = getHlsPlaylistPath(hlsDirectory);
        const ffmpegCmd = buildFfmpegCommand(FFmpegConfig.videoDevice, FFmpegConfig.audioDevice, playlistPath);
        const ffmpegProcess = spawnFfmpeg(ffmpegCmd);

        ffmpegProcess.on("close", (code) => {
            logger.info(`FFmpeg exited with code ${code}`);
            this.processes.delete(scheduleId);
        });

        this.processes.set(scheduleId, ffmpegProcess);

        return {
            process: ffmpegProcess,
            streamKey,
            hlsUrl: `${process.env.HLS_URL}/${streamKey}/index.m3u8`
        };
    };

    async stopStream(scheduleId: string): Promise<boolean> {
        const process = this.processes.get(scheduleId);
        if (!process || !process.pid) return false;
        try {
            await killFfmpegProcess(process.pid);
            this.processes.delete(scheduleId);
            return true;
        } catch (error) {
            return false;
        }
    }
}