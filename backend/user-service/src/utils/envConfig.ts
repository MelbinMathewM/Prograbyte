import { env } from "../config/env";

export function validateEnv() {
    if (!env.PORT) {
        throw new Error("PORT is not found in the env");
    }
    if (!env.MONGO_URI) {
        throw new Error("MONGO_URI is not found in the env");
    }
    if (!env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not found in the env");
    }
    if (!env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not found in the env");
    }
    if (!env.GOOGLE_CLIENT_ID) {
        throw new Error("GOOGLE_CLIENT_ID is not found in the env");
    }
    if (!env.GOOGLE_CLIENT_SECRET) {
        throw new Error("GOOGLE_CLIENT_SECRET is not found in the env");
    }
    if (!env.BACKEND_URL) {
        throw new Error("BACKEND_URL is not found in env");
    }
    if (!env.FRONTEND_URL) {
        throw new Error("FRONTEND_URL is not found in env");
    }
    if (!env.RABBITMQ_URL) {
        throw new Error("RABBITMQ_URL is not found in env");
    }
}