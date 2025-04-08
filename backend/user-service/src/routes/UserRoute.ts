import { Request, Response, Router } from "express";
import passport from "passport";
import container from "../configs/inversify.config";
import { UserController } from "../controllers/implementations/user.controller";
import bodyParser from "body-parser";
import stripe from "../configs/stripe.config";
import Stripe from "stripe";
import express from "express";

const userRouter = Router();
const userController = container.get(UserController);

userRouter.post('/register',(req,res,next) => userController.registerUser(req,res,next));
userRouter.get('/user',(req,res,next) => userController.getUser(req,res,next));
userRouter.get('/user/:userId',(req,res,next) => userController.getUserById(req,res,next));
userRouter.get('/profile/:userId',(req,res,next) => userController.getProfile(req,res,next));
userRouter.patch('/profile/:userId',(req,res,next) => userController.updateProfile(req,res,next));
userRouter.post('/verify-email-link', (req,res,next) => userController.verifyEmailLink(req,res,next));
userRouter.get('/verify-email', (req,res,next) => userController.verifyEmail(req,res,next));

userRouter.post('/skills/:userId',(req,res,next) => userController.addSkill(req,res,next));
userRouter.patch('/skills/:userId',(req,res,next) => userController.editSkill(req,res,next));
userRouter.delete('/skills/:userId/:skill',(req,res,next) => userController.deleteSkill(req,res,next));

userRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res,next) => {
    userController.googleAuthCallback(req,res,next) 
});
  

// Checkout session route
userRouter.post(
    "/payment/create-checkout-session",
    bodyParser.json(),
    (req, res) => userController.createCheckoutSession(req, res)
);
userRouter.post("/tutor-register",(req,res,next) => userController.registerTutor(req,res,next));

export default userRouter;