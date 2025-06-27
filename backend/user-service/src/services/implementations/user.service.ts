import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../repositories/interfaces/IUser.repository';
import { IUser } from '../../models/user.model';
import authClient from '../../grpcs/auth-client.grpc';
import { createHttpError } from '../../utils/http-error.util';
import { HttpStatus } from '../../constants/status.constant';
import { HttpResponse } from '../../constants/response.constant';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.util';
import { publishMessage } from '../../utils/rabbitmq.util';
import { IUserService } from '../interfaces/IUser.service';

@injectable()
export class UserService implements IUserService {
    constructor(@inject("IUserRepository") private _userRepository: IUserRepository) { }

    async registerUser(user: IUser): Promise<void> {

        const existingUser = await this._userRepository.findOne({email: user.email});

        if (existingUser) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
        }

        const newUser = await this._userRepository.create(user);

        const grpcResponse = await new Promise<{ success: boolean, message: string }>(
            (resolve, reject) => {
                authClient.RegisterUser(
                    { _id: newUser._id as string, email: user.email, password: user.password, role: user.role },
                    (err: any, response: any) => {
                        if (err) {
                            console.error("gRPC Error:", err);
                            return reject(err);
                        }
                        resolve(response);
                    }
                );
            }
        );

        if (!grpcResponse.success) {
            await this._userRepository.deleteById(newUser._id as string);
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.GRPC_REGISTER_ERROR)
        }

        const userData = {
            _id: newUser._id,
            username:newUser.username
        }

        publishMessage("user.registered.blog",userData);
    }

    async registerTutor(tutor: IUser): Promise<void> {
        const existingUser = await this._userRepository.findOne({email: tutor.email});

        if (existingUser) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.TUTOR_EMAIL_EXIST_ERROR);
        }

        const newTutor = await this._userRepository.create(tutor);

        const grpcResponse = await new Promise<{ success: boolean, message: string }>(
            (resolve, reject) => {
                authClient.RegisterUser(
                    { _id: newTutor._id as string, email: tutor.email, password: tutor.password, role: "tutor" },
                    (err: any, response: any) => {
                        if (err) {
                            console.error("gRPC Error:", err);
                            return reject(err);
                        }
                        resolve(response);
                    }
                );
            }
        );

        if (!grpcResponse.success) {
            await this._userRepository.deleteById(newTutor._id as string);
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.GRPC_REGISTER_ERROR);
        }

        const userData = {
            _id: newTutor._id,
            username:newTutor.username
        }

        publishMessage("user.registered",userData);
    }


    async registerUserGAuth(userData: { googleId: string; email: string; name: string }): Promise<{ accessToken: string, refreshToken: string, role: string }> {

        if (!userData) throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND);

        let user = await this._userRepository.findOne({email: userData.email});

        let newUser;
        if (!user) {
            const newUserData: Partial<IUser> = {
                googleId: userData.googleId,
                email: userData.email,
                name: userData.name,
                role: "student",
            };
            newUser = await this._userRepository.create(newUserData as IUser);
        } else {
            newUser = user;
        }

        const payload = { id: newUser._id, role: newUser.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { accessToken, refreshToken, role: newUser.role }

    }

    async getUserByXId(id: string): Promise<Partial<IUser>> {

        const user = await this._userRepository.findById(id);

        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        if(user.isBlocked){
            throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
        }

        const newUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            isPremium: user.isPremium
        }

        return newUser;
    }

    async getUserById(userId: string): Promise<Partial<IUser>> {

        const user = await this._userRepository.findById(userId);

        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const newUser = {
            _id: user._id,
            name: user.name,
            username: user.username
        }

        return newUser;
    }

    async getProfile(userId: string): Promise<IUser> {

        const user = await this._userRepository.findById(userId);

        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        return user;
    }

    async updateProfile(userId: string, updatedUser: Partial<IUser>): Promise<IUser> {

        if (updatedUser.username) {
            const existingUser = await this._userRepository.findOne({ username: updatedUser.username });

            if (existingUser && (existingUser._id as string).toString() !== userId) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USERNAME_EXIST);
            }
        }


        const user = await this._userRepository.updateById(userId, updatedUser);

        if(user && updatedUser.username){
            publishMessage("username.updated.blog",{updatedUser, userId});
        }

        if(user && updatedUser.email){
            user.isEmailVerified = false;
            await this._userRepository.save(user);
        }

        if (!user) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PROFILE_UPDATE_ERROR);
        }

        return user;
    }

    async verifyEmailLink(email: string): Promise<void> {
        
        publishMessage("user.verify_email", { email });
    }

    async verifyEmail(email: string): Promise<void> {

        const user = await this._userRepository.findOne({ email });

        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        user.isEmailVerified = true;
        await this._userRepository.save(user);
    }

    async addSkill(userId: string, skill: string): Promise<string[]> {

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        if (user.skills.includes(skill)) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SKILL_EXIST);
        }

        user.skills.push(skill);
        await user.save();

        return user.skills;
    }

    async editSkill(userId: string, oldSkill: string, newSkill: string): Promise<string[]> {

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        const skillIndex = user.skills.indexOf(oldSkill);
        if (skillIndex === -1) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.SKILL_NOT_FOUND);
        }

        if(user.skills.includes(newSkill)){
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SKILL_EXIST);
        }

        user.skills[skillIndex] = newSkill;
        await user.save();

        return user.skills;
    }

    async deleteSkill(userId: string, skill: string): Promise<string[]> {

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        user.skills = user.skills.filter((s) => s !== skill);
        await user.save();

        return user.skills;
    }

    async updateToPremium(email: string): Promise<void> {
        const user = await this._userRepository.findOne({ email });

        if (!user) {
            throw new Error("User not found");
        }

        user.isPremium = true;
        await this._userRepository.save(user);

        console.log(`✅ User ${email} upgraded to Premium!`);
    }

    async getTutors(): Promise<IUser[]> {
        
        const tutors = await this._userRepository.findAll({ role: "tutor" });

        return tutors;
    }

    async getUsers(): Promise<IUser[]> {
        
        const users = await this._userRepository.findAll({ role: "student" });

        return users;
    }

    async updateTutorStatus(tutorId: string, action: string): Promise<string> {
        
        const tutor = await this._userRepository.findById(tutorId);

        if(!tutor){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TUTOR_NOT_FOUND);
        }

        let message: string = '';
        if(action === "approve"){
            tutor.isTutorVerified = true;
            message = HttpResponse.TUTOR_APPROVED;

        }else if(action === "block"){
            tutor.isBlocked = true;
            message = HttpResponse.TUTOR_BLOCKED;

        }else if(action === "unblock"){
            tutor.isBlocked = false;
            message = HttpResponse.TUTOR_UNBLOCKED; 
        }

        await this._userRepository.save(tutor);

        return message;
    }

    async updateUserStatus(userId: string, action: string): Promise<string> {
        
        const user = await this._userRepository.findById(userId);

        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        let message: string = '';
        if(action === "block"){
            user.isBlocked = true;
            message = HttpResponse.USER_BLOCKED;

        }else if(action === "unblock"){
            user.isBlocked = false;
            message = HttpResponse.USER_UNBLOCKED; 
        }

        await this._userRepository.save(user);

        return message;
    }

    async revokePremium(userId: string): Promise<void> {
        
        const user = await this._userRepository.findById(userId);

        if(user){
            user.isPremium = false;
            await this._userRepository.save(user);
        }
    }
}