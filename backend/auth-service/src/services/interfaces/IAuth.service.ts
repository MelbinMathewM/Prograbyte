import { IAuth } from "../../models/auth.model";

export interface IAuthService {
    loginUser(email: string, password: string): Promise<{ accessToken: string, refreshToken: string, role: string }>;
    refreshToken(token: string): Promise<string | null>;
    createUserByGrpc(authData: IAuth): Promise<void>;
    sendOtp(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, password: string): Promise<void>;
}