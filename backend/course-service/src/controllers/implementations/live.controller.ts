import { injectable, inject } from "inversify";
import { ILiveController } from "../interfaces/ILive.controller";
import { LiveService } from "@/services/implementations/live.service";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";

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

    async getScheduleById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { schedule_id } = req.params;

            if(!schedule_id){
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
                return;
            }

            const schedule = await this._liveService.getSchedule(schedule_id);

            res.status(HttpStatus.OK).json({ schedule });
        }catch(err){
            next(err);
        }
    }

    async getLiveSchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { tutor_id, course_id } = req.query;

            let schedules;
            if(tutor_id){
                schedules = await this._liveService.getLiveScheduleByTutorId(tutor_id as string);
            }else if(course_id){
                schedules = await this._liveService.getLiveScheduleByCourseId(course_id as string);
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

            if(!schedule_id){
                res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.MISSING_OR_INVALID_FIELDS });
                return;
            }

            if (status.status === "live") {

                const token = req.headers["authorization"]?.split(' ')[1];
                const { streamUrl, streamKey } = await this._liveService.startStream(schedule_id, status, token as string);
                
                res.status(HttpStatus.OK).json({ message: HttpResponse.STATUS_UPDATED, streamUrl, streamKey });
            } else if (status.status === "completed") {

                const token = req.headers["authorization"]?.split(' ')[1];
                await this._liveService.endStream(schedule_id, status, token as string);
    
                res.status(HttpStatus.OK).json({ message: HttpResponse.STATUS_UPDATED });
            } else {

                await this._liveService.changeLiveStatus(schedule_id, status);

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