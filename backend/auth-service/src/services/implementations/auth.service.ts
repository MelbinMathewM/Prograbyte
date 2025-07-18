import { inject, injectable } from "inversify";
import { JwtPayload } from 'jsonwebtoken';
import { IAuthRepository } from "../../repositories/interfaces/IAuth.repository";
import redisClient from "../../configs/redis.config";
import { createHttpError } from "../../utils/http-error.util";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response.constant";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken, verifyResetToken } from "../../utils/jwt.util";
import { IAuth } from "../../models/auth.model";
import { generateOtp } from "../../utils/otp.util";
import { publishMessage } from "../../utils/rabbitmq.util";
import { IAuthService } from "../interfaces/IAuth.service";

@injectable()
export class AuthService implements IAuthService {
    constructor(@inject("IAuthRepository") private _authRepository: IAuthRepository) { }

    async loginUser(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, role: string }> {

        const user = await this._authRepository.findOne({email});

        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.PASSWORD_INCORRECT);

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

        await this._authRepository.create(authData);
    }

    async sendOtp(email: string): Promise<void> {

        const existingUser = await this._authRepository.findOne({email});

        if(existingUser){
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
        }

        const otp = generateOtp();

        await redisClient.set(`otp:${email}`, otp, "EX", 90);

        publishMessage("auth.send_otp", {
            email: email,
            otp: otp
        });

    }

    async verifyOtp(email: string, otp: string): Promise<void> {

        const storedOtp = await redisClient.get(`otp:${email}`);

        if (!storedOtp) {
            throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
        }
        if (storedOtp !== otp) {
            throw createHttpError(HttpStatus.CONFLICT, HttpResponse.OTP_INVALID);
        }

        await redisClient.del(`otp:${email}`);

    }

    async forgotPassword(email: string): Promise<void> {

        const user = await this._authRepository.findOne({email});

        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const resetToken = generateResetToken({ email });

        await redisClient.set(`resetToken:${user._id}`, resetToken, "EX", 900);

        publishMessage("auth.forgot_password", {
            email: email,
            resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        });

        console.log(`📩 Sent reset email request to Notification Service for ${email}`);
    }

    async resetPassword(token: string, password: string): Promise<void> {

        if (!token) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.NO_RESET_TOKEN);

        const decoded = verifyResetToken(token) as JwtPayload;

        if (!decoded) throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.NO_DECODED_TOKEN);

        const user = await this._authRepository.findOne({ email: decoded.email });

        if (!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        user.password = await hashPassword(password);

        await user.save();
    }
}