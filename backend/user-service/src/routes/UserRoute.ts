import { Router } from "express";
import passport from "passport";
import container from "../di/container";
import { UserController } from "../controllers/UserController";

const userRouter = Router();
const userController = container.get(UserController);

userRouter.post('/register',(req,res,next) => userController.registerUser(req,res,next));
userRouter.get('/user',(req,res,next) => userController.getUser(req,res,next));
userRouter.get('/profile/:userId',(req,res,next) => userController.getProfile(req,res,next));
userRouter.patch('/profile/:userId',(req,res,next) => userController.updateProfile(req,res,next));

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
userRouter.post("/tutor-register",(req,res,next) => userController.registerTutor(req,res,next));

export default userRouter;