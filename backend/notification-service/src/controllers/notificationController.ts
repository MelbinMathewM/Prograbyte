import { Request, Response } from "express";
import { inject } from "inversify";
import { NotificationService } from "../services/notificationService";

export class NotificationController {
    constructor(@inject(NotificationService) private otpService: NotificationService) {}


}
