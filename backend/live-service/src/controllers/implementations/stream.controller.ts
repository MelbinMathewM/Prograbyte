import { IStreamController } from "../../controllers/interfaces/IStream.controller";
import { Request, Response, NextFunction } from "express";
import { spawn, ChildProcessWithoutNullStreams, exec } from "child_process";
import fs from "fs";
import path from "path";
import logger from "@/utils/logger.util";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { inject } from "inversify";
import { StreamService } from "@/services/implementations/stream.service";
import { IStreamService } from "@/services/interfaces/IStream.service";

export class StreamController implements IStreamController {
    private ffmpegProcesses: Map<string, ChildProcessWithoutNullStreams> = new Map();

    constructor(
        @inject(StreamService) private _streamService: IStreamService
    ) { }

    async startStream(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule_id } = req.body;

            logger.info("Starting Stream...");

            const { hlsUrl, streamKey } = await this._streamService.startStream(schedule_id);

            res.json({ success: true, hlsUrl, streamKey });
        } catch (err) {
            next(err);
        }
    }

    async stopStream(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { schedule_id } = req.body;
            logger.info(`Stopping Stream for schedule_id: ${schedule_id}`);

            const success = await this._streamService.stopStream(schedule_id);

            if (!success) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, error: HttpResponse.STREAM_NOT_FOUND });
                return;
            }

            res.status(HttpStatus.OK).json({ success: true, message: HttpResponse.STREAM_STOPPED });
        } catch (err) {
            next(err);
        }
    }
}
