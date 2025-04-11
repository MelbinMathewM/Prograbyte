import "reflect-metadata";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./configs/db.config";
import passport from "passport";
import "./configs/passport.config";
import session from "express-session";
import userRouter from "./routes/user.route";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config();

import { validateEnv } from "./utils/env-config.util";
import verifyApiKey from "./configs/api-key.config";
import { env } from "./configs/env.config";
import stripe from "./configs/stripe.config";
import { initializeRabbitMQ } from "./configs/rabbitmq.config";
validateEnv();

const app = express();
const PORT = process.env.PORT || 5002;

// Stripe webhook endpoint must come before any body parsers
app.post(
    "/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response): Promise<any> => {
        console.log("🔹 Webhook Received");

        try {
            const sig = req.headers["stripe-signature"];
            if (!sig) {
                console.error("❌ Missing Stripe Signature");
                return res.status(400).send("Missing Stripe Signature");
            }

            let event;
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    process.env.STRIPE_WEBHOOK_SECRET as string
                );
            } catch (err: any) {
                console.error("⚠️ Webhook Signature Verification Failed:", err.message);
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            console.log('22')
            // Handle the event
            switch (event.type) {
                case 'payment_intent.succeeded':
                    const paymentIntent = event.data.object;
                    console.log('Payment succeeded:', paymentIntent.id);
                    break;
                // Add other event types as needed
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }

            console.log("✅ Webhook Verified!", event);
            return res.status(200).send("Webhook received");
        } catch (error) {
            console.error("❌ Webhook Processing Error:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
);

// Regular middleware setup - must come AFTER the webhook route
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(helmet());
app.use(verifyApiKey as express.RequestHandler);

app.use(session({ 
    secret: env.SESSION_SECRET_KEY!, 
    resave: false, 
    saveUninitialized: true 
}));

connectDB();

app.use(passport.initialize());
app.use(passport.session());

app.use('/', userRouter);
app.use(errorHandler);

(async () => {
    await initializeRabbitMQ();
})();

app.listen(PORT, () => {
    console.log(`User service running on PORT ${PORT}`);
});