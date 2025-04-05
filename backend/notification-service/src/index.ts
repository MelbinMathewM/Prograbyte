import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes";
import connectRabbitMQ from "./config/rabbitmq";
import { startNotificationService } from "./rabbitmq/notificationService";

dotenv.config();

import { validateEnv } from "./utils/envConfig";
import verifyApiKey from "./config/apiKey";
validateEnv();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(verifyApiKey as express.RequestHandler);


app.use("/", notificationRoutes);

const PORT = process.env.PORT || 5006;

app.listen(PORT, async () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
    await connectRabbitMQ();
    await startNotificationService()
});
