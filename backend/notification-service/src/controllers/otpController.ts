import { Request, Response } from "express";
import { inject } from "inversify";
import { OtpService } from "../services/otpService";

export class NotificationController {
    constructor(@inject(OtpService) private otpService: OtpService) {}

    async sendOtp(req: Request, res: Response): Promise<any> {
        try {
            console.log('hiii')
            const { email } = req.body;
            if (!email) return res.status(400).json({ error: "Email is required" });

            const result = await this.otpService.generateOtp(email);
            console.log(result)
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<any> {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

            const result = await this.otpService.verifyOtp(email, otp);
            if (result.error) return res.status(400).json(result);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
