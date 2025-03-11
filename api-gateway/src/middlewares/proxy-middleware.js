import { createProxyMiddleware } from "http-proxy-middleware";

const publicRoutes = ["/api/user/register"];

const createProxy = (target, basePath) => {
  if (!target) {
    return (req, res) => res.status(500).json({ error: "Proxy target not set" });
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    logLevel: "silent",
    pathRewrite: {
      [`^${basePath}`]: "",
    },
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader("x-api-key", process.env.API_GATEWAY_KEY || "MISSING");

      if (!publicRoutes.includes(req.originalUrl) && req.newAccessToken) {
        proxyReq.setHeader("Authorization", `Bearer ${req.newAccessToken}`);
      }
    },
  });
};

export default createProxy;
