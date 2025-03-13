import { env } from "../config/env";
import transporter from "../config/nodemailer";

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
    try {
        await transporter.sendMail({
            from: env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        });
    } catch (error) {
        console.error("Email Sending Error:", error);
    }
};
