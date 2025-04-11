import express, { Application } from "express";
import dotenv from "dotenv";
import streamRouter from "./routes/stream.route";
import logger from "./utils/logger.util";
import { errorHandler } from "./middlewares/error.middleware";
import { exec } from "child_process";

dotenv.config();

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/stream', streamRouter);
app.use(errorHandler);

const startRTMPServer = () => {
    exec("docker inspect -f '{{.State.Running}}' nginx-rtmp", (error, stdout, stderr) => {
        if (!stderr && stdout.trim() === "true") {
            console.log("RTMP Server is already running.");
            return;
        }

        if (!stderr && stdout.trim() === "false") {
            console.log("Starting existing NGINX-RTMP container...");
            exec("docker start nginx-rtmp", (err, out) => {
                if (err) {
                    console.error(`Error starting RTMP server: ${err.message}`);
                    return;
                }
                console.log(`RTMP Server started: ${out}`);
            });
            return;
        }

        console.log("NGINX-RTMP container not found. Creating...");
        exec(
            `docker run -d --name nginx-rtmp \
            -p 1935:1935 \
            -p 8080:80 \
            -v "//c/Users/User/Coding Items/Second-project/backend/live-service/hls:/opt/data/hls" \
            alfg/nginx-rtmp`,
            (err, out) => {
                if (err) {
                    console.error(`Error creating RTMP server: ${err.message}`);
                    return;
                }
                console.log(`RTMP Server created: ${out}`);
            }
        );
    });
};

startRTMPServer();


const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
})