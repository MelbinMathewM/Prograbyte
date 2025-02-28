import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { env } from "../config/env";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
    try {
        await transporter.sendMail({
            from: env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        });
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Email Sending Error:", error);
    }
};
