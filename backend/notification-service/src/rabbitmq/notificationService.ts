import { connectRabbitMQ, consumeQueue } from "./fromAuthForgPass";
import { sendEmail } from "../utils/email";

export const startNotificationService = async () => {
  await connectRabbitMQ();

  consumeQueue("forgot_password", async (msg) => {
    if (!msg) return;

    const { email, resetLink } = JSON.parse(msg.content.toString());

    const emailBody = `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" style="
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          ">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `;

    await sendEmail(email, "Reset Your Password", emailBody);

    console.log(`✅ Reset email sent to ${email}`);
  });

  consumeQueue("send_otp", async (msg) => {
    if (!msg) return;

    const { email, otp } = JSON.parse(msg.content.toString());

    const emailBody = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
        <h2 style="color: #007bff;">Your OTP Code</h2>
        <p style="font-size: 16px;">Use the OTP below to verify your account:</p>
        <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f8f9fa; display: inline-block; border-radius: 5px;">
          ${otp}
        </div>
        <p style="color: red; font-size: 14px;">This OTP is valid for only 1 minute.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(email, "Your OTP code", emailBody);

    console.log(`otp ${otp} send to ${email}`);

  })
};