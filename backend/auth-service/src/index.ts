import "reflect-metadata";
import dotenv from "dotenv";
import express, { Application } from "express";
import authRoutes from "./routes/auth.route";
import connectDB from "./configs/db.config";
import startGRPCServer from "./grpcs/auth-server.grpc";
import cookieParser from 'cookie-parser';
import { errorHandler } from "./middlewares/error.middlewate";

dotenv.config();

import { validateEnv } from "./utils/env-config.util";
import verifyApiKey from "./configs/api-key.config";
import helmet from "helmet";
import { initializeRabbitMQ } from "./configs/rabbitmq.config";
validateEnv();

const app: Application = express();
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
