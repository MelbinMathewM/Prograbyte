import { Router } from "express";
import container from "../di/container";
import { NotificationController } from "../controllers/otpController";

const router = Router();
const notificationController = container.get<NotificationController>(NotificationController);

router.post("/send-otp", (req, res) => notificationController.sendOtp(req, res));
router.post("/verify-otp", (req, res) => notificationController.verifyOtp(req, res));


export default router;
