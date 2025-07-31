import { env } from "@/configs/env.config";

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
    if (!env.AUTH_DOMAIN) {
        throw new Error("AUTH_DOMAIN is not found in env");
    }
    if (!env.FRONTEND_URL) {
        throw new Error("FRONTEND_URL is not found in env");
    }
    if (!env.RABBITMQ_URL) {
        throw new Error("RABBITMQ_URL is not found in env");
    }
    if (!env.API_GATEWAY_KEY) {
        throw new Error("API_GATEWAY_KEY is not found in the env");
    }
    if (!env.SESSION_SECRET_KEY) {
        throw new Error("SESSION_SECRET_KEY is not found in the env");
    }
    if (!env.STRIPE_SECRET_KEY) {
        throw new Error("STRIPE_SECRET_KEY is not found in the env");
    }
    if (!env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not found in the env")
    }
}