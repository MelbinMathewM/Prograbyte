import { createProxyMiddleware } from "http-proxy-middleware";

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

export default createProxy;