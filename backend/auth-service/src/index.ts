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
validateEnv();

const app = express();
app.use(cookieParser())

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/", authRoutes);
app.use(errorHandler)

startGRPCServer();
connectRabbitMQ();

// Start server
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
