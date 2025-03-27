import { NextFunction, Request, Response } from "express";

export interface ILiveController {
    postLiveSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLiveSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeLiveScheduleStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkLiveScheduleStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}