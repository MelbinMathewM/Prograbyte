import express from "express";
import dotenv from "dotenv";
import router from "./routes/routes";
import connectDB from "./configs/db.config";
import { errorHandler } from "./middlewares/error.middlewate";

dotenv.config();

import { validateEnv } from "./utils/env-config.util";
import { startRabbitMQConsumer } from "./services/rabbitmq.service";
import verifyApiKey from "./configs/api-key.config";
import { env } from "./configs/env.config";
import { server } from "@/configs/inversify.config";

validateEnv();

connectDB();

const app = express();

const PORT = env.PORT || 5006;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(verifyApiKey as express.RequestHandler);

app.use('/',router);
app.use(errorHandler);

startRabbitMQConsumer();

server.listen(PORT,() => console.log(`course service running on port ${PORT}`))