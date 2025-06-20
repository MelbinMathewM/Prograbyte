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
  origin: "http://localhost:5173",
  credentials: true,
};

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
app.use("/api/user",verifyToken, createProxy(process.env.USER_SERVICE, "/api/user"));
app.use("/api/course", verifyToken, createProxy(process.env.COURSE_SERVICE, "/api/course"));
app.use("/api/blog",verifyToken, createProxy(process.env.BLOG_SERVICE, "/api/blog"));
app.use("/api/live", createProxy(process.env.LIVE_SERVICE, "/api/live"));
app.use("/api/notification", createProxy(process.env.NOTIFICATION_SERVICE, "/api/notification"));
app.use("/api/payment", createProxy(process.env.PAYMENT_SERVICE, "/api/payment"));

server.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
