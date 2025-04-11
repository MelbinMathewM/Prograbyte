import { sendEmail } from "../utils/email.util";
import { consumeMessages } from "../utils/rabbitmq.util";

export const startUserConsumer = async (): Promise<void> => {
    console.log("User Consumer started");

    consumeMessages("verify_email", "user_service", "user.verify_email", async (msg) => {
        if (!msg) return;

        const { email } = JSON.parse(msg.content.toString());

        const emailBody = `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
                <h2 style="color: #007bff;">Verify Your Email</h2>
                <p style="font-size: 16px;">Click the button below to verify your email and activate your Prograbyte account:</p>
                <a href="http://localhost:5000/api/user/verify-email?&email=${encodeURIComponent(email)}"
                    style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; font-size: 16px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
                <p style="color: red; font-size: 14px;">If you did not create this account, please ignore this email.</p>
            </div>
        `;

        await sendEmail(email, "verify email", emailBody);
        console.log(`verification link send to ${email}`)
    })
}