import express, { Application } from "express";
import dotenv from "dotenv";
import streamRouter from "./routes/stream.route";
import logger from "./utils/logger.util";
import { errorHandler } from "./middlewares/error.middleware";
import { startRTMPServer } from "./services/implementations/rtmp.service";
import verifyApiKey from "./configs/api-key.config";

dotenv.config();

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verifyApiKey as express.RequestHandler);


app.use('/stream', streamRouter);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
    startRTMPServer();
}



const PORT = process.env.PORT || 8080;
app.listen(PORT as number, "0.0.0.0", () => {
    logger.info(`Server started on port ${PORT}`);
});