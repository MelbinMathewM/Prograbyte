import { HttpResponse } from "@/constants/response.constant";
import { HttpStatus } from "@/constants/status.constant";
import { Request, Response, NextFunction } from "express";
import { env } from "./env.config";

const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== env.API_GATEWAY_KEY) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: HttpResponse.ACCESS_DENIED });
    }
    next();
};

export default verifyApiKey;