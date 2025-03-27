import express, { Application } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import verifyToken from "./middlewares/verify-token.middleware";
import createProxy from "./middlewares/proxy.middleware";
import { BlogGateway } from "./sockets/blog.socket";
import { LiveGateway } from "./sockets/live.socket";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Enable CORS
app.use(cors(corsOptions));

// Initialize Socket Gateway
const blogGateway = new BlogGateway(io);
blogGateway.initialize();

const liveGateway = new LiveGateway(io);
liveGateway.initialize();

const PORT = process.env.PORT || 5000;

// Proxy routes
app.use("/api/auth", createProxy(process.env.AUTH_SERVICE, "/api/auth"));
app.use("/api/user", createProxy(process.env.USER_SERVICE, "/api/user"));
app.use("/api/course", verifyToken, createProxy(process.env.COURSE_SERVICE, "/api/course"));
app.use("/api/notification", createProxy(process.env.NOTIFICATION_SERVICE, "/api/notification"));
app.use("/api/blog", createProxy(process.env.BLOG_SERVICE, "/api/blog"));

// ✅ FIXED: Start server with `server.listen()`
server.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
