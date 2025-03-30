import { NextFunction, Request, Response } from "express";
import { inject } from 'inversify';
import { UserService } from "../services/UserService";
import { IUser } from "../models/UserModel";
import { env } from "../config/env";
import { HttpStatus } from "../constants/status";
import { HttpResponse } from "../constants/responseMessage";
import stripe from "../config/stripe";
import Stripe from "stripe";

export class UserController {
  constructor(@inject(UserService) private userService: UserService) { }

  async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user: IUser = req.body;

      await this.userService.registerUser(user);

      res.status(HttpStatus.CREATED).json({ message: HttpResponse.USER_REGISTERED });
    } catch (err) {
      next(err)
    }
  }

  async registerTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tutor: IUser = req.body;

      const createdTutor = await this.userService.registerTutor(tutor);

      res.status(201).json(createdTutor);
    } catch (err) {
      next(err)
    }
  }

  async googleAuthCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const user = req.user as { googleId: string; email: string; name: string };

      const { accessToken, refreshToken, role } = await this.userService.registerUserGAuth(user);

      res.cookie(`refreshToken_${role}`, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${env.FRONTEND_URL}/login/callback?accessToken=${accessToken}&role=${role}`);

    } catch (err) {
      next(err)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers["authorization"]?.split(' ')[1];

      const user = await this.userService.getUserByToken(token!);

      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const { userId } = req.params;

      console.log(userId,'hh')

      const user = await this.userService.getUserById(userId);

      res.status(HttpStatus.OK).json({ user });
    }catch(err){
      next(err);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await this.userService.getProfile(userId);

      res.status(HttpStatus.OK).json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const user = await this.userService.updateProfile(userId, updateData);

      res.status(HttpStatus.OK).json({ message: HttpResponse.PROFILE_UPDATED, user });
    } catch (err) {
      next(err);
    }
  }

  async addSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { skill } = req.body;
      const { userId } = req.params;

      const skills = await this.userService.addSkill(userId, skill);

      res.status(HttpStatus.OK).json({ message: HttpResponse.SKILL_ADDED, skills })
    } catch (err) {
      next(err);
    }
  }

  async editSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldSkill, newSkill } = req.body;
      const { userId } = req.params;

      const skills = await this.userService.editSkill(userId, oldSkill, newSkill);

      res.status(HttpStatus.OK).json({ message: HttpResponse.SKILL_EDITED, skills })
    } catch (err) {
      next(err);
    }
  }

  async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, skill } = req.params;

      const skills = await this.userService.deleteSkill(userId, skill);

      res.status(HttpStatus.OK).json({ message: HttpResponse.SKILL_DELETED, skills });
    } catch (err) {
      next(err);
    }
  }

  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: email, // Associate the session with the user
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Premium Subscription",
                description: "Get full access to all premium features.",
              },
              unit_amount: 999, // $9.99 in cents
              recurring: { interval: "month" }, // Monthly subscription
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error("❌ Error creating checkout session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async stripeWebhook(req: Request, res: Response): Promise<void> {
    try {
      const sig = req.headers["stripe-signature"];
      console.log(sig,'hhs');
      if (!sig) {
        res.status(400).send("Missing Stripe Signature");
        return;
      }

      let event;
      try {
        const rawBody = req.body;
        console.log(rawBody,'raw')
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
      } catch (err: any) {
        console.error("⚠️  Webhook signature verification failed.", err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Process event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const email = session.customer_email;

        if (email) {
          await this.userService.updateToPremium(email);
          console.log(`✅ User ${email} upgraded to Premium`);
        }
      }

      res.status(200).send("Webhook received.");
    } catch (error) {
      console.error("❌ Webhook processing error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}