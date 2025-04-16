import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import path from "path";
import fs from "fs";
import logger from "./logger.util";

export const createHlsDirectory = (streamKey: string): string => {
    const hlsDirectory = path.resolve(__dirname, "../../hls", streamKey);
    if (!fs.existsSync(hlsDirectory)) {
      fs.mkdirSync(hlsDirectory, { recursive: true });
    }
    return hlsDirectory;
};

export const getHlsPlaylistPath = (hlsDirectory: string): string => {
    return path.join(hlsDirectory, "index.m3u8");
};

export const buildFfmpegCommand = (videoDevice: string, audioDevice: string, outputPath: string): string[] => {
    return [
      "-loglevel", "warning",
      "-rtbufsize", "150M",
      "-f", "dshow",
      "-video_size", "1280x720",
      "-framerate", "10",
      "-pixel_format", "yuyv422",
      "-i", `video=${videoDevice}`,
      "-f", "dshow",
      "-i", `audio=${audioDevice}`,
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
      outputPath,
    ];
};

export const spawnFfmpeg = (cmd: string[]): ChildProcessWithoutNullStreams => {
    const ffmpeg = spawn("ffmpeg", cmd);
    ffmpeg.stderr.on("data", (data) => {
      logger.error(`FFmpeg Log: ${data.toString()}`);
    });
    return ffmpeg;
};

export const killFfmpegProcess = (pid: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      exec(`taskkill /PID ${pid} /T /F`, (err, stdout, stderr) => {
        if (err) {
          logger.error(`Failed to kill FFmpeg process: ${err.message}`);
          return reject(err);
        }
        logger.info(`FFmpeg process terminated successfully: ${stdout}`);
        resolve(stdout);
      });
    });
};