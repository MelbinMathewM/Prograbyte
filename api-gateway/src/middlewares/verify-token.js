import jwt from "jsonwebtoken";

const publicRoutes = [
    "/api/user/register", 
    // "/api/auth/login", 
    // "/api/auth/refresh-token",
];

const verifyToken = (req, res, next) => {
    if (publicRoutes.includes(req.path)) {
        return next();
    }
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

export default verifyToken;