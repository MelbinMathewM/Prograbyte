import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/AuthRoutes";
import connectDB from "./configs/db";
import startGRPCServer from "./grpc/AuthServer";
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middlewares/errorMiddlewate";

dotenv.config();

import { validateEnv } from "./utils/envConfig";
import verifyApiKey from "./configs/apiKey";
import helmet from "helmet";
import { initializeRabbitMQ } from "./configs/rabbitmq.config";
validateEnv();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(verifyApiKey as express.RequestHandler);

connectDB();

// Routes
app.use("/", authRoutes);
app.use(errorHandler);

startGRPCServer();
(async () => {
    await initializeRabbitMQ();
  })();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
