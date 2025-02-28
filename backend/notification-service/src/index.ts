import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes";
import connectRabbitMQ from "./config/rabbitmq";
import { startNotificationService } from "./rabbitmq/notificationService";

dotenv.config();

import { validateEnv } from "./utils/envConfig";
validateEnv();

const app = express();
app.use(express.json());


app.use("/", notificationRoutes);

const PORT = process.env.PORT || 5004;

app.listen(PORT, async () => {
    console.log(`🚀 Notification Service running on port ${PORT}`);
    await connectRabbitMQ();
    await startNotificationService()
});
