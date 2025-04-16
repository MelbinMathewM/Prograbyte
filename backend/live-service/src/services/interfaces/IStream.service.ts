import { ChildProcessWithoutNullStreams } from "child_process";

export interface IStreamService {
    startStream(schedule_id: string): Promise<{ process: ChildProcessWithoutNullStreams, streamKey: string, hlsUrl: string }>;
    stopStream(schedule_id: string): Promise<boolean>;
}