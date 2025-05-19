import { Request, Response, Router } from "express";
import passport from "passport";
import container from "../configs/inversify.config";
import { UserController } from "../controllers/implementations/user.controller";
import bodyParser from "body-parser";

const userRouter = Router();
const userController = container.get<UserController>(UserController);

userRouter.post('/register', userController.registerUser.bind(userController));
userRouter.get('/user', userController.getUser.bind(userController));
userRouter.get('/user/:userId', userController.getUserById.bind(userController));
userRouter.get('/profile/:userId', userController.getProfile.bind(userController));
userRouter.patch('/profile/:userId', userController.updateProfile.bind(userController));
userRouter.post('/verify-email-link', userController.verifyEmailLink.bind(userController));
userRouter.get('/verify-email', userController.verifyEmail.bind(userController));
userRouter.post('/skills/:userId', userController.addSkill.bind(userController));
userRouter.patch('/skills/:userId', userController.editSkill.bind(userController));
userRouter.delete('/skills/:userId/:skill', userController.deleteSkill.bind(userController));
userRouter.post("/upgrade", userController.updateToPremium.bind(userController));
userRouter.put("/user/:userId/revoke-premium", userController.revokePremium.bind(userController));

userRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
userRouter.get("/google/callback", passport.authenticate("google", { session: false }), userController.googleAuthCallback.bind(userController));

userRouter.post("/tutor-register", userController.registerTutor.bind(userController));
userRouter.get("/tutors", userController.getTutors.bind(userController));
userRouter.get("/users", userController.getUsers.bind(userController));
userRouter.patch('/tutors/:tutorId/status', userController.updateTutorStatus.bind(userController));
userRouter.patch('/users/:userId/status', userController.updateUserStatus.bind(userController));

export default userRouter;