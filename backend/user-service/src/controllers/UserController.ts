import { NextFunction, Request, Response } from "express";
import { inject } from 'inversify';
import { UserService } from "../services/UserService";
import { IUser } from "../models/UserModel";
import { env } from "../config/env";

export class UserController {
  constructor(@inject(UserService) private userService: UserService) { }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: IUser = req.body;

      const createdUser = await this.userService.registerUser(user);

      res.status(201).json(createdUser);
    } catch (err) {
      next(err)
    }
  }

  async registerTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tutor: IUser = req.body;

      const createdTutor = await this.userService.registerTutor(tutor);

      res.status(201).json(createdTutor);
    } catch (err) {
      next(err)
    }
  }

  async googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const user = req.user as { googleId: string; email: string; name: string };

      const { accessToken, refreshToken, role } = await this.userService.registerUserGAuth(user);

      res.cookie(`refreshToken_${role}`, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${env.FRONTEND_URL}/login/callback?accessToken=${accessToken}&role=${role}`);

    } catch (err) {
      next(err)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(' ')[1];

      console.log(token)

      const user = await this.userService.getUserById(token!);

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}