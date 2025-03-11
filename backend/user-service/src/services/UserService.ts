import { inject, injectable } from 'inversify';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IUser } from '../models/UserModel';
import authClient from '../grpc/AuthServiceClient';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createHttpError } from '../utils/httpError';
import { HttpStatus } from '../constants/status';
import { HttpResponse } from '../constants/responseMessage';
import { generateAccessToken, generateRefreshToken, verifyAccessToken } from '../utils/jwt';
import { rabbitMQService } from './RabbitMQService';

@injectable()
export class UserService {
    constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}

    async registerUser(user: IUser): Promise<IUser> {

        const existingUser = await this.userRepository.getUserByEmail(user.email);

        if (existingUser) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
        }

        const newUser = await this.userRepository.createUser(user);

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
            await this.userRepository.deleteUserById(newUser._id as string);
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.GRPC_REGISTER_ERROR)
        }
    
        return newUser;
    }

    async registerTutor(tutor: IUser): Promise<IUser> {
        const existingUser = await this.userRepository.getUserByEmail(tutor.email);
    
        if (existingUser) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.TUTOR_EMAIL_EXIST_ERROR);
        }
    
        const newTutor = await this.userRepository.createUser(tutor);
    
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
            await this.userRepository.deleteUserById(newTutor._id as string);
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.GRPC_REGISTER_ERROR);
        }

        const tutorData = {
            _id: newTutor._id,
            email: newTutor.email,
            name: newTutor.name,
        };

        await rabbitMQService.publishMessage("tutor.registered", tutorData);
    
        return newTutor;
    }
    

    async registerUserGAuth(userData: { googleId: string; email: string; name: string }): Promise<{accessToken: string, refreshToken: string, role: string}> {

        if(!userData) throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_NOT_FOUND);

        let user = await this.userRepository.getUserByEmail(userData.email);

        let newUser;
        if (!user) {
            const newUserData: Partial<IUser> = {
                googleId: userData.googleId,
                email: userData.email,
                name: userData.name,
                role: "student",
            };
            newUser = await this.userRepository.createUser(newUserData as IUser);
        }else{
            newUser = user;
        }

        const payload = { id: newUser._id, role: newUser.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {accessToken, refreshToken, role: newUser.role}
        
    }

    async getUserById(token: string): Promise<Partial<IUser>> {

        if(!token) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_ACCESS_TOKEN);

        const decoded = verifyAccessToken(token) as JwtPayload;

        if(!decoded) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_DECODED_TOKEN);
        
        const user = await this.userRepository.getUserById(decoded.id);

        if(!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const newUser = {
            _id: user._id,
            email: user.email,
            name: user.name,
        }

        return newUser;
    }

    async getProfile(userId: string): Promise<IUser> {

        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        }

        return user;
    }

    async updateProfile(userId: string, updatedUser: Partial<IUser>): Promise<IUser> {

        const user = await this.userRepository.updateUser(userId, updatedUser);

        if (!user) {
            throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.PROFILE_UPDATE_ERROR);
        }

        return user;
    }
}