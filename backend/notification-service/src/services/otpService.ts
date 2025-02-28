import redisClient from "../config/redis";
import { sendEmail } from "../utils/email";
import { injectable } from "inversify";

@injectable()
export class OtpService {
    async generateOtp(email: string) {
        try {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await redisClient.set(`otp:${email}`, otp, { EX: 90 });
            const emailBody = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
                <h2 style="color: #007bff;">Your OTP Code</h2>
                <p style="font-size: 16px;">Use the OTP below to verify your account:</p>
                <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f8f9fa; display: inline-block; border-radius: 5px;">
                    ${otp}
                </div>
                <p style="color: red; font-size: 14px;">This OTP is valid for only 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
            `;
            await sendEmail(email, "Your OTP Code",emailBody);
            console.log(redisClient.get(`otp:${email}`))
            return { message: "OTP sent successfully" };
        } catch (error) {
            return { error: "Failed to send OTP" };
        }
    }

    async verifyOtp(email: string, otp: string) {
        try {
            const storedOtp = await redisClient.get(`otp:${email}`);
            if (!storedOtp) return { error: "OTP expired or not found" };
            if (storedOtp !== otp) return { error: "Invalid OTP" };
            
            console.log(storedOtp, otp);
            await redisClient.del(`otp:${email}`);
            return { message: "OTP verified successfully" };
        } catch (error) {
            return { error: "Failed to verify OTP" };
        }
    }
}
