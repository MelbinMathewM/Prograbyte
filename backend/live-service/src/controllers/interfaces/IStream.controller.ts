import { NextFunction, Request, Response } from "express";

export interface IStreamController {
    startStream(req: Request, res: Response, next: NextFunction): Promise<void>;
}