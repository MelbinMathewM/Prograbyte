import { connectRabbitMQ, consumeQueue } from "./fromAuthForgPass";
import { sendEmail } from "../utils/email";

export const startNotificationService = async () => {
    await connectRabbitMQ();
  
    consumeQueue("forgot_password", async (msg) => {
      if (!msg) return;
  
      const { email, resetLink } = JSON.parse(msg.content.toString());
      console.log(resetLink,'hii')
  
      console.log(`📩 Sending reset email to ${email}`);

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
};