import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes";
import {initializeRabbitMQ} from "./configs/rabbitmq.config";
import { startAuthConsumer } from "./rabbitmqs/auth.consumer";

dotenv.config();

import { validateEnv } from "./utils/envConfig.util";
import verifyApiKey from "./configs/apiKey.config";
import { startUserConsumer } from "./rabbitmqs/user.consumer";
import "./configs/redis.config";
validateEnv();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verifyApiKey as express.RequestHandler);


app.use("/", notificationRoutes);

const PORT = process.env.PORT || 5006;

app.listen(PORT, async () => {
    console.log(`Notification Service running on port ${PORT}`);
    await initializeRabbitMQ();
    await startAuthConsumer();
    await startUserConsumer();
});
