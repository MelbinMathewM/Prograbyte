import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const publicRoutes = [
  "/api/user/register",
  "/api/course/topics/proxy-stream",
  "/api/user/stripe/webhook",
  "/api/user/tutor-register",
];

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (publicRoutes.some((route) => req.originalUrl.startsWith(route))) {
    console.log("Public route, skipping token verification:", req.originalUrl);
    return next();
  }

  const authHeader = req.headers["authorization"];
  console.log(authHeader, "bb");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid Token" });
    }

    req.user = decoded;
    
    if (typeof decoded === "object" && decoded !== null) {
      console.log('hii');
      req.headers["x-id"] = decoded.id as string;
      req.headers["x-role"] = decoded.role as string;
    }
    next();
  });
};

export default verifyToken;
