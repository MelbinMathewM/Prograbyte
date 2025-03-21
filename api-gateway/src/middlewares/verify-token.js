import jwt from "jsonwebtoken";

const publicRoutes = ["/api/user/register", "/api/user/tutor-register"]; // Update to match your actual route

const verifyToken = (req, res, next) => {

  if (publicRoutes.some((route) => req.originalUrl.startsWith(route))) {
    console.log("Public route, skipping token verification:", req.originalUrl);
    return next();
}
  const authHeader = req.headers["authorization"];
  console.log(authHeader,'bb')
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
