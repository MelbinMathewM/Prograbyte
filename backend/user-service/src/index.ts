import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./configs/db.config";
import passport from "passport";
import "./configs/passport.config";
import session from "express-session";
import userRouter from "./routes/user.route";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

import { validateEnv } from "./utils/env-config.util";
import verifyApiKey from "./configs/api-key.config";
import { env } from "./configs/env.config";
import { initializeRabbitMQ } from "./configs/rabbitmq.config";

validateEnv();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(verifyApiKey as express.RequestHandler);

app.use(session({ 
    secret: env.SESSION_SECRET_KEY!, 
    resave: false, 
    saveUninitialized: true 
}));

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);
app.use(errorHandler);

(async () => {
    await initializeRabbitMQ();
})();

app.listen(PORT, () => {
    console.log(`User service running on PORT ${PORT}`);
});