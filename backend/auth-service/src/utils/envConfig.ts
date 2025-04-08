import { env } from "../configs/env.config";

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
    if (!env.REDIS_URL) {
        throw new Error("REDIS_URL is not found in the env");
    }
    if (!env.API_GATEWAY_KEY) {
        throw new Error("API_GATEWAY_KEY is not found in the env");
    }
    if(!env.RABBITMQ_URL) {
        throw new Error("RABBITMQ_URL is not found in the env");
    }
}