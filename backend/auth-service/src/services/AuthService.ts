import { inject, injectable } from "inversify";
import { JwtPayload } from 'jsonwebtoken';
import { IAuthRepository } from "../repositories/interfaces/IAuthRepository";
import redisClient from "../config/redis";
import { publishToQueue } from "../rabbitmq/ToNotification";
import { createHttpError } from "../utils/httpError";
import { HttpStatus } from "../constants/status";
import { HttpResponse } from "../constants/responseMessage";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken, verifyResetToken } from "../utils/jwt";
import { IAuth } from "../models/AuthModel";

@injectable()
export class AuthService {
    constructor(@inject("IAuthRepository") private authRepository: IAuthRepository) {}

    async loginUser(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, role: string }> {

        const user = await this.authRepository.getUserByEmail(email);
        
        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        
        const isMatch = await comparePassword(password, user.password);
        
        if(!isMatch) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.PASSWORD_INCORRECT);

        console.log('hii')
        
        const payload = { id: user._id, role: user.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return { accessToken, refreshToken, role: user.role };
    }

    async refreshToken(token: string): Promise<string | null> {

        if (!token) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.NO_REFRESH_TOKEN);

        const decoded = verifyRefreshToken(token) as JwtPayload;

        if (!decoded) throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);

        const payload = { id: decoded.id, role: decoded.role }

        const newAccessToken = generateAccessToken(payload);

        return newAccessToken
    }

    async createUserByGrpc(authData: IAuth): Promise<void> {

        await this.authRepository.createUserByGrpc(authData);
    }

    async forgotPassword(email: string): Promise<void> {

        const user = await this.authRepository.getUserByEmail(email);

        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const resetToken = generateResetToken({email});

        await redisClient.set(`resetToken:${user._id}`, resetToken, { EX: 900 });

        publishToQueue("forgot_password", {
            email: email,
            resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        });

        console.log(`📩 Sent reset email request to Notification Service for ${ email }`);
    }

    async resetPassword(token: string, password: string): Promise<void> {

        if (!token) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.NO_RESET_TOKEN);

        const decoded = verifyResetToken(token) as JwtPayload;

        if (!decoded) throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);

        const user = await this.authRepository.getUserByEmail(decoded.email);

        if(!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        user.password = await hashPassword(password);

        await user.save();
    }
}