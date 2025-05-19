import { NextFunction, Request, Response } from "express";
import { inject } from 'inversify';
import { UserService } from "../../services/implementations/user.service";
import { IUser } from "../../models/user.model";
import { env } from "../../configs/env.config";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response.constant";
import { IUserController } from "../interfaces/IUser.controller";
import { error } from "console";

export class UserController implements IUserController {
  constructor(@inject(UserService) private _userService: UserService) { }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: IUser = req.body;

      await this._userService.registerUser(user);

      res.status(HttpStatus.CREATED).json({ message: HttpResponse.USER_REGISTERED });
    } catch (err) {
      next(err)
    }
  }

  async registerTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tutor: IUser = req.body;

      const createdTutor = await this._userService.registerTutor(tutor);

      res.status(201).json(createdTutor);
    } catch (err) {
      next(err)
    }
  }

  async googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const user = req.user as { googleId: string; email: string; name: string };

      const { accessToken, refreshToken, role } = await this._userService.registerUserGAuth(user);

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
      const id = req.headers["x-id"];

      if (!id) {
        res.status(HttpStatus.NOT_FOUND).json({ error: HttpResponse.USER_ID_NOT_FOUND });
        return;
      }

      const user = await this._userService.getUserByXId(id as string);

      res.status(HttpStatus.OK).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this._userService.getUserById(userId);

      res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      next(err);
    }
  }

  async getTutors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const tutors = await this._userService.getTutors();

      res.status(HttpStatus.OK).json({ tutors });
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const users = await this._userService.getUsers();

      res.status(HttpStatus.OK).json({ users });
    } catch (err) {
      next(err);
    }
  }

  async updateTutorStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tutorId } = req.params;
      const { action } = req.body;

      if (!tutorId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_NOT_FOUND });
        return;
      }

      const message = await this._userService.updateTutorStatus(tutorId, action);

      res.status(HttpStatus.OK).json({ message })
    } catch (err) {
      next(err);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { action } = req.body;

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_NOT_FOUND });
        return;
      }

      const message = await this._userService.updateUserStatus(userId, action);

      res.status(HttpStatus.OK).json({ message })
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this._userService.getProfile(userId);

      res.status(HttpStatus.OK).json({ user });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const user = await this._userService.updateProfile(userId, updateData);

      res.status(HttpStatus.OK).json({ message: HttpResponse.PROFILE_UPDATED, user });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmailLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).json({ error: HttpResponse.EMAIL_NOT_FOUND });
        return;
      }

      await this._userService.verifyEmailLink(email);

      res.status(HttpStatus.OK).json({ message: HttpResponse.VERIFY_LINK_SEND });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.query;

      if (!email) {
        res.status(HttpStatus.NOT_FOUND).send(`<h3>${HttpResponse.EMAIL_NOT_FOUND}</h3>`);
        return;
      }

      await this._userService.verifyEmail(email as string);

      res.redirect(`${env.FRONTEND_URL}/profile`);
    } catch (err) {
      next(err);
    }
  }

  async addSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { skill } = req.body;
      const { userId } = req.params;

      const skills = await this._userService.addSkill(userId, skill);

      res.status(HttpStatus.OK).json({ message: HttpResponse.SKILL_ADDED, skills })
    } catch (err) {
      next(err);
    }
  }

  async editSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldSkill, newSkill } = req.body;
      const { userId } = req.params;

      const skills = await this._userService.editSkill(userId, oldSkill, newSkill);

      res.status(HttpStatus.OK).json({ message: HttpResponse.SKILL_EDITED, skills })
    } catch (err) {
      next(err);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, skill } = req.params;

      const skills = await this._userService.deleteSkill(userId, skill);

      res.status(HttpStatus.OK).json({ message: HttpResponse.SKILL_DELETED, skills });
    } catch (err) {
      next(err);
    }
  }

  async updateToPremium(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;

    await this._userService.updateToPremium(email);

    res.status(HttpStatus.OK).send("User updated");
  }

  async revokePremium(req: Request, res: Response, next: NextFunction): Promise<void> {
      try{
        const { userId } = req.body;

        if(!userId){
          res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.USER_ID_NOT_FOUND });
          return;
        }

        await this._userService.revokePremium(userId);

        res.status(HttpStatus.OK).json({ message: HttpResponse.PREMIUM_REVOKED });
      }catch(err){
        next(err);
      }
  }
}