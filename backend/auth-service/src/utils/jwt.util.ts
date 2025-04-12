import jwt from 'jsonwebtoken';
import { env } from '../configs/env.config';

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';
const RESET_TOKEN_EXPIRY = '15m';

export function generateAccessToken(payload: Object): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET as string, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: Object): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET as string, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export function generateResetToken(payload: Object): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET as string, { expiresIn: RESET_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET as string);
    } catch (err) {
        console.error(err);
        return null;
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET as string);
    } catch (err) {
        console.error(err);
        return null;
    }
}

export function verifyResetToken(token: string) {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET as string);
    } catch (err) {
        console.error(err);
        return null;
    }
}