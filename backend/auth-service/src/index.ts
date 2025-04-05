import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/AuthRoutes";
import connectDB from "./config/db";
import startGRPCServer from "./grpc/AuthServer";
import cookieParser from 'cookie-parser';
import { connectRabbitMQ } from "./rabbitmq/ToNotification";
import { errorHandler } from "./middlewares/errorMiddlewate";

dotenv.config();

import { validateEnv } from "./utils/envConfig";
import verifyApiKey from "./config/apiKey";
import helmet from "helmet";
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
connectRabbitMQ();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
