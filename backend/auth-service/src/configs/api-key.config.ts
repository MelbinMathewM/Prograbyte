import { Request, Response, NextFunction } from "express";
import { env } from "./env.config";

const verifyApiKey = (req: Request, res: Response, next: NextFunction) => {

    const internalIps = ['::1', '127.0.0.1'];

    if (internalIps.includes(req.ip as string)) {
        return next();
    }

    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== env.API_GATEWAY_KEY) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

export default verifyApiKey;