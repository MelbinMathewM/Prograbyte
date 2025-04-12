import { Router } from "express";
import { AuthController } from "../controllers/implementations/auth.controller";
import container from "../configs/inversify.config";

const router = Router();
const authController = container.get(AuthController);

router.post("/login",authController.login.bind(authController));
router.post("/refresh_token", authController.refreshToken.bind(authController));
router.post('/send-otp', authController.sendOtp.bind(authController));
router.post('/verify-otp', authController.verifyOtp.bind(authController));
router.post('/forgot_password', authController.forgotPassword.bind(authController));
router.post('/reset_password', authController.resetPassword.bind(authController));

export default router;
