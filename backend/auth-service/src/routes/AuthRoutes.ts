import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import container from "../di/container";
import passport from "passport";

const router = Router();
const authController = container.get(AuthController);

router.post("/login",(req, res, next) => authController.login(req, res, next));
router.post("/refresh_token",(req,res,next) => authController.refreshToken(req,res,next));
router.post('/forgot_password',(req,res,next) => authController.forgotPassword(req,res,next));
router.post('/reset_password',(req,res,next) => authController.resetPassword(req,res,next));

export default router;
