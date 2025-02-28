import { env } from "../config/env";

export function validateEnv() {
    if (!env.PORT) {
        throw new Error("PORT is not found in the env");
    }
    if (!env.MONGO_URI) {
        throw new Error("MONGO_URI is not found in the env");
    }
    if (!env.CLOUDINARY_CLOUD_NAME) {
        throw new Error("CLOUDINARY_CLOUD_NAME is not found in the env");
    }
    if (!env.CLOUDINARY_API_KEY) {
        throw new Error("CLOUDINARY_API_KEY is not found in the env");
    }
    if (!env.CLOUDINARY_API_SECRET) {
        throw new Error("CLOUDINARY_API_SECRET is not found in the env");
    }
}