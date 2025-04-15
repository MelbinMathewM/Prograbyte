import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
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

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.includes("/stripe/webhook")) {
        console.log('hii', req.originalUrl)
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json({ limit: "5mb" })(req, res, (err) => {
        if (err) return next(err);
        express.urlencoded({ limit: "5mb", extended: true })(req, res, next);
      });
    }
  });
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