import express, { Application } from "express";
import dotenv from "dotenv";
import streamRouter from "./routes/stream.route";
import logger from "./utils/logger.util";
import { errorHandler } from "./middlewares/error.middleware";
import { exec } from "child_process";
import path from "path";
import { formatPathForDocker } from "./utils/docker.util";

dotenv.config();

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/stream', streamRouter);
app.use(errorHandler);

const startRTMPServer = () => {
    exec(`docker ps -a --filter "name=^/nginx-rtmp$" --format "{{.Names}}"`, (error, stdout, stderr) => {
        if (error || stderr) {
            logger.error("Error checking for existing container:", error || stderr);
            return;
        }

        const containerExists = stdout.trim() === "nginx-rtmp";

        if (containerExists) {
            exec(`docker inspect -f "{{.State.Running}}" nginx-rtmp`, (err, runningOut) => {
                if (err) {
                    logger.error("Error inspecting container:", err.message);
                    return;
                }

                if (runningOut.trim() === "true") {
                    logger.info("RTMP Server is already running.");
                } else {
                    logger.info("Starting existing NGINX-RTMP container...");

                    exec("docker start nginx-rtmp", (startErr, startOut) => {
                        if (startErr) {
                            logger.error("Error starting container:", startErr.message);
                        } else {
                            logger.info("RTMP Server started.");
                        }
                    });
                }
            });
        } else {
            logger.info("NGINX-RTMP container not found. Creating...");

            const hlsDirectory: string = path.resolve(__dirname, "../hls");
            const hlsDockerPath: string = formatPathForDocker(hlsDirectory);

            exec(
                `docker run -d --name nginx-rtmp \
                -p 1935:1935 \
                -p 8080:80 \
                -v "${hlsDockerPath}:/opt/data/hls" \
                alfg/nginx-rtmp`,
                (runErr, runOut) => {
                    if (runErr) {
                        logger.error("Error creating RTMP server:", runErr.message);
                    } else {
                        logger.log("RTMP Server created:", runOut);
                    }
                }
            );
        }
    });
};

startRTMPServer();


const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
})