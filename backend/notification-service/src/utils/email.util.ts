import nodemailer from "nodemailer";
import { env } from "../configs/env.config";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
    try {
        console.log(process.env.EMAIL_PASS, 'jj');
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        });
    } catch (error) {
        console.error("Email Sending Error:", error);
    }
};

export default transporter;
