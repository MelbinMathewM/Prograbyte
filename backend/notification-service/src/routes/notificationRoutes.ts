import { Router } from "express";
import container from "../di/container";
import { NotificationController } from "../controllers/notificationController";

const router = Router();
const notificationController = container.get<NotificationController>(NotificationController);


export default router;
