import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";

import verifyToken from "./middlewares/verify-token";
import createProxy from "./middlewares/proxy-middleware";

dotenv.config();

const app: Application = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

// Proxy routes
app.use("/api/auth", createProxy(process.env.AUTH_SERVICE, "/api/auth"));
app.use("/api/user", createProxy(process.env.USER_SERVICE, "/api/user"));
app.use("/api/course", verifyToken, createProxy(process.env.COURSE_SERVICE, "/api/course"));
app.use("/api/notification", createProxy(process.env.NOTIFICATION_SERVICE, "/api/notification"));
app.use("/api/blog", createProxy(process.env.BLOG_SERVICE, "/api/blog"));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
