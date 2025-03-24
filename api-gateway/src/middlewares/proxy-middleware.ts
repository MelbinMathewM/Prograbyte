import { Request, Response } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { IncomingMessage, ServerResponse } from "http";

const publicRoutes: string[] = ["/api/user/register"];

interface CustomRequest extends Request {
  newAccessToken?: string;
}

const createProxy = (target?: string, basePath?: string) => {
  if (!target) {
    return (req: Request, res: Response) =>
      res.status(500).json({ error: "Proxy target not set" });
  }

  const proxyOptions: Options = {
    target,
    changeOrigin: true,
    secure: false,
    logLevel: "silent",
    pathRewrite: basePath ? { [`^${basePath}`]: "" } : undefined,
    onProxyReq: (proxyReq, req: IncomingMessage) => {
      proxyReq.setHeader("x-api-key", process.env.API_GATEWAY_KEY || "MISSING");

      const customReq = req as CustomRequest;
      if (!publicRoutes.includes(customReq.originalUrl) && customReq.newAccessToken) {
        proxyReq.setHeader("Authorization", `Bearer ${customReq.newAccessToken}`);
      }
    },
  };

  return createProxyMiddleware(proxyOptions);
};

export default createProxy;
