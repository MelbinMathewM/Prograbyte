import { injectable, inject } from "inversify";
import { ILiveController } from "../interfaces/ILive.controller";
import { LiveService } from "@/services/implementations/live.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import axios from "axios";

@injectable()
export class LiveController implements ILiveController{
    constructor(@inject(LiveService) private _liveService: LiveService) {}

    async postLiveSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const schedule = req.body;

            await this._liveService.postLiveSchedule(schedule);

            res.status(HttpStatus.CREATED).json({ message: HttpResponse.LIVE_SCHEDULED });
        }catch(err){
            next(err);
        }
    }

    async getLiveSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { tutor_id } = req.query;

            let schedules;
            if(tutor_id){
                schedules = await this._liveService.getLiveScheduleByTutorId(tutor_id as string);
            }

            res.status(HttpStatus.OK).json({ liveSchedules: schedules });
        }catch(err){
            next(err);
        }
    }

    async changeLiveScheduleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { schedule_id } = req.params;
            const status = req.body;
            console.log(status,'j')

            if(!schedule_id){
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
                return;
            }

            await this._liveService.changeLiveStatus(schedule_id, status);

            console.log('hii')

            if (status.status === "live") {
                console.log('huu');
                const token = req.headers["authorization"]?.split(' ')[1];
                console.log(token);
                const liveStreamResponse = await axios.post("http://localhost:5000/api/live/stream/start-stream", {
                    schedule_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!liveStreamResponse.data.success) {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to start live stream" });
                    return;
                }
    
                res.status(HttpStatus.OK).json({ message: HttpResponse.STATUS_UPDATED, streamUrl: liveStreamResponse.data.url });
            } else {
                res.status(HttpStatus.OK).json({ message: HttpResponse.STATUS_UPDATED });
            }
        }catch(err){
            next(err);
        }
    }

    async checkLiveScheduleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { schedule_id } = req.params;

            if(!schedule_id){
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
                return;
            }

            const canStart = await this._liveService.checkLiveStatus(schedule_id);

            res.status(HttpStatus.OK).json({ canStart });
        }catch(err){
            next(err);
        }
    }
}