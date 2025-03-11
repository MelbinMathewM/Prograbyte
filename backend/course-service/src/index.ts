import express from "express";
import dotenv from "dotenv";
import courseRouter from "./routes/courseRoutes";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/errorMiddlewate";

dotenv.config();

import { validateEnv } from "./utils/envConfig";
import { startRabbitMQConsumer } from "./services/rabbitMQService";
import verifyApiKey from "./config/apiKey";
validateEnv();

const app = express();

const PORT = process.env.PORT || 5006;

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(verifyApiKey as express.RequestHandler);

app.use('/',courseRouter);
app.use(errorHandler);

startRabbitMQConsumer();

app.listen(PORT,() => console.log(`course service running on port ${PORT}`))