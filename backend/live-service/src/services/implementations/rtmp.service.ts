import { exec } from "child_process";
import path from "path";
import logger from "@/utils/logger.util";
import { formatPathForDocker } from "@/utils/docker.util";
import { RTMP_CONFIG } from "@/configs/rtmp.config";

export const startRTMPServer = (): void => {
    exec(`docker ps -a --filter "name=^/${RTMP_CONFIG.containerName}$" --format "{{.Names}}`, (error, stdout, stderr) => {
        if (error || stderr) {
            logger.error("Error checking for existing container:", error || stderr);
            return;
        }

        const containerExists = stdout.trim() === RTMP_CONFIG.containerName;

        if(containerExists){
            exec(`docker inspect -f "{{.State.Running}}" ${RTMP_CONFIG.containerName}`, (err, runningOut) => {
                if (err) {
                    logger.error("Error inspecting container:", err.message);
                    return;
                }

                if (runningOut.trim() === "true") {
                    logger.info("RTMP Server is already running.");

                } else {
                    logger.info("Starting existing NGINX-RTMP container...");

                    exec(`docker start ${RTMP_CONFIG.containerName}`, (startErr, startOut) => {
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

            const hlsDirectory: string = path.resolve(__dirname, "../../../hls");
            const hlsDockerPath: string = formatPathForDocker(hlsDirectory);

            exec(
                `docker run -d --name ${RTMP_CONFIG.containerName} \
                -p ${RTMP_CONFIG.ports.rtmp}:1935 \
                -p ${RTMP_CONFIG.ports.http}:80 \
                -v "${hlsDockerPath}:${RTMP_CONFIG.mountPath}" \
                ${RTMP_CONFIG.image}`,
                (runErr, runOut) => {
                  if (runErr) {
                    logger.error("Error creating RTMP server:", runErr.message);
                  } else {
                    logger.info("RTMP Server created:", runOut);
                  }
                }
            );
        }
      
    })
}