import express, { Application } from "express";
import dotenv from "dotenv";
import streamRouter from "@/routes/stream.route";
import logger from "@/utils/logger.util";
import { errorHandler } from "@/middlewares/error.middleware";

dotenv.config();

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/stream', streamRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
})