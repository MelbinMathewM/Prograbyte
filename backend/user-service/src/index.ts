import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/db";
import passport from "passport";
import "./config/passport";
import session from "express-session";
import userRouter from "./routes/UserRoute";
import { errorHandler } from "./middlewares/errorMiddlewate";

dotenv.config();

import { validateEnv } from "./utils/envConfig";
import { rabbitMQService } from "./services/RabbitMQService";
import verifyApiKey from "./config/apiKey";
validateEnv();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(helmet());
app.use(verifyApiKey as express.RequestHandler);

app.use(session({ secret: "SECRET_KEY", resave: false, saveUninitialized: true }));

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);
app.use(errorHandler);

(async () => {
    await rabbitMQService.connect();
})();

app.listen(PORT,()=> {
    console.log(`User service running on PORT ${PORT}`);
})