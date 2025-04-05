import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";
import { HttpStatus } from "../constants/status.config";
import { HttpResponse } from "../constants/response.constant";

export const errorHandler = (
    err: HttpError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = HttpResponse.SERVER_ERROR;

    if(err instanceof HttpError){
        statusCode = err.statusCode;
        message = err.message;
    }else{
        console.log("Unhandled", err)
    }

    res.status(statusCode).json({ error: message });
}