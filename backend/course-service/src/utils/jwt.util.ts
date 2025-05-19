import jwt from 'jsonwebtoken';

import { env } from '../configs/env.config';

const TOKEN_EXPIRY = '15m';

export function generateToken(payload: Object): string {
    return jwt.sign(payload, env.TOKEN_SECRET as string, { expiresIn: TOKEN_EXPIRY });
};

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, env.TOKEN_SECRET as string);
    } catch (err) {
        console.error(err);
        return null;
    }
};