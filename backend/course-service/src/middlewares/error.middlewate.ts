import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response.constant";
import logger from "@/utils/logger.util";

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
    logger.error(`Error: ${err.message}`)
    res.status(statusCode).json({ error: message });
}