import { Router } from "express";
import passport from "passport";
import container from "../di/container";
import { UserController } from "../controllers/UserController";

const userRouter = Router();
const userController = container.get(UserController);

userRouter.post('/register',(req,res,next) => userController.registerUser(req,res,next));
userRouter.get('/user',(req,res,next) => userController.getUser(req,res,next));
userRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res,next) => {
    userController.googleAuthCallback(req,res,next) 
});
userRouter.post("/tutor-register",(req,res,next) => userController.registerTutor(req,res,next));

export default userRouter;