import { NextFunction, Request, Response } from "express";

export interface IWishlistController {
  getWishlist(req: Request, res: Response, next: NextFunction): Promise<void>;
  addToWishlist(req: Request, res: Response, next: NextFunction): Promise<void>;
  removeFromWishlist(req: Request, res: Response, next: NextFunction): Promise<void>;
}
