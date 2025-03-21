import { Request, Response, NextFunction } from "express";

export interface ITopicController {
  createTopic(req: Request, res: Response, next: NextFunction): Promise<void>;
  editTopic(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTopics(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTopic(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeTopic(req: Request, res: Response, next: NextFunction): Promise<void>;
  videoUrlToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  getSecureUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  proxyStream(req: Request, res: Response, next: NextFunction): Promise<void>;
}
