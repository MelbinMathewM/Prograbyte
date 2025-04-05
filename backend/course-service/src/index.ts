import express from "express";
import dotenv from "dotenv";
import router from "@/routes/routes";
import connectDB from "@/configs/db.config";
import { errorHandler } from "@/middlewares/error.middlewate";

dotenv.config();

import { validateEnv } from "@/utils/env-config.util";
import { startRabbitMQConsumer } from "@/services/rabbitmq.service";
import verifyApiKey from "@/configs/api-key.config";
import { env } from "@/configs/env.config";
import { server, app } from "@/configs/inversify.config";
import logger from "@/utils/logger.util";

validateEnv();

connectDB();

const PORT = env.PORT || 5003;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(verifyApiKey as express.RequestHandler);

app.use('/',router);
app.use(errorHandler);

startRabbitMQConsumer();

server.listen(PORT,() => logger.info(`Server started on port ${PORT}`))