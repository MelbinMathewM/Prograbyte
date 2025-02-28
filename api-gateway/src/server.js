import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

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

// Token verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {

        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = decoded;
    next();
  });
};


// Proxy setup for services
const createProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req) => {
      if (req.newAccessToken) {
        proxyReq.setHeader("Authorization", `Bearer ${req.newAccessToken}`);
      }
    },
  });

  
// Route services (protected & unprotected)
app.use("/api/auth", createProxy(process.env.AUTH_SERVICE));
app.use("/api/user", createProxy(process.env.USER_SERVICE));
app.use("/api/course", verifyToken, createProxy(process.env.COURSE_SERVICE));
app.use("/api/notification", createProxy(process.env.NOTIFICATION_SERVICE));


app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
