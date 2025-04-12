import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { AuthService } from "../../services/implementations/auth.service";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response.constant";
import { IAuthController } from "../interfaces/IAuth.controller";

export class AuthController implements IAuthController {
  constructor(@inject(AuthService) private _authService: AuthService) { }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { email, password } = req.body;

      const data = await this._authService.loginUser(email, password);

      res.cookie(`refreshToken_${data?.role}`, data?.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ accessToken: data?.accessToken, role: data?.role });

    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body)
      const { role } = req.body;
      const refreshToken = req.cookies[`refreshToken_${role}`];

      const accessToken = await this._authService.refreshToken(refreshToken);

      res.status(200).json(accessToken);
    } catch (err) {
      next(err)
    }
  }

  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.EMAIL_REQUIRED });
      }

      await this._authService.sendOtp(email);

      res.status(HttpStatus.OK).json({ message: HttpResponse.OTP_SEND });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.EMAIL_REQUIRED });
      }

      if (!otp) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: HttpResponse.OTP_REQUIRED });
      }

      await this._authService.verifyOtp(email, otp);

      res.status(HttpStatus.OK).json({ message: HttpResponse.OTP_VERIFIED});
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { email } = req.body;

      await this._authService.forgotPassword(email);

      res.status(200).json({ message: "Password reset email sent" });

    } catch (err) {
      next(err)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;

      await this._authService.resetPassword(token, password);

      res.status(200).json({ message: "Password reset successfull" });

    } catch (err) {
      next(err)
    }
  }
}