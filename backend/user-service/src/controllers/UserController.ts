import { NextFunction, Request, Response } from "express";
import { inject } from 'inversify';
import { UserService } from "../services/UserService";
import { IUser } from "../models/UserModel";
import { env } from "../config/env";
import { HttpStatus } from "../constants/status";
import { HttpResponse } from "../constants/responseMessage";

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

      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId } = req.params;

      const user = await this.userService.getProfile(userId);

      res.status(HttpStatus.OK).json(user);
    }catch(err){
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId } = req.params;
      const updateData = req.body;

      const user = await this.userService.updateProfile(userId, updateData);

      res.status(HttpStatus.OK).json({message: HttpResponse.PROFILE_UPDATED,user});
    }catch(err){
      next(err);
    }
  }

  async addSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { skill } = req.body;
      const { userId } = req.params;

      const skills = await this.userService.addSkill(userId, skill);

      res.status(HttpStatus.OK).json({message: HttpResponse.SKILL_ADDED, skills})
    }catch(err){
      next(err);
    }
  }

  async editSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { oldSkill, newSkill } = req.body;
      const { userId } = req.params;

      const skills = await this.userService.editSkill(userId, oldSkill, newSkill);

      res.status(HttpStatus.OK).json({message: HttpResponse.SKILL_EDITED, skills})
    }catch(err){
      next(err);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId, skill } = req.params;

      const skills = await this.userService.deleteSkill(userId, skill);

      res.status(HttpStatus.OK).json({message: HttpResponse.SKILL_DELETED, skills});
    }catch(err){
      next(err);
    }
  }
}