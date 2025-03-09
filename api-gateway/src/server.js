import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import verifyToken from "./middlewares/verify-token.js";
import createProxy from "./middlewares/proxy-middleware.js";

dotenv.config();

const app = express();
app.use(cookieParser());

const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

  
// Route services (protected & unprotected)
app.use("/api/auth", createProxy(process.env.AUTH_SERVICE));
app.use("/api/user",verifyToken, createProxy(process.env.USER_SERVICE));
app.use("/api/course", verifyToken, createProxy(process.env.COURSE_SERVICE));
app.use("/api/notification", createProxy(process.env.NOTIFICATION_SERVICE));


app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
