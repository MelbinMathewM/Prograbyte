import express from "express";
import http from "http";
import dotenv from "dotenv";
import router from "./routes/routes";

dotenv.config();

import { validateEnv } from "@/utils/validate-env.util";
import verifyApiKey from "@/configs/api-key.config";
import connectDB from "@/configs/db.config";
import { errorHandler } from "@/middlewares/error.middleware";
import { initializeRabbitMQ } from "@/configs/rabbitmq.config";
import { usernameChangeConsumer, userRegisteredConsumer } from "@/rabbitmqs/user.consumer";
import { Server } from "socket.io";
import { socketConfig } from "@/configs/socket.config";
import container from "@/configs/inversify.config";
import { SocketService } from "./services/implementations/socket.service";

validateEnv();

connectDB();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verifyApiKey as express.RequestHandler);

const server = http.createServer(app);

const io = new Server(server, socketConfig);

container.bind<Server>("SocketIO").toConstantValue(io);
const socketService = container.get<SocketService>("SocketService");
socketService.init();

app.use('/',router);

app.use(errorHandler);

(async () => {
    await initializeRabbitMQ();
    await userRegisteredConsumer();
    await usernameChangeConsumer();
  })();


const PORT = process.env.PORT || 5004;
server.listen(PORT, () => { console.log(`Blog service running on PORT ${PORT}`) })