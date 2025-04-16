import { env } from "@/configs/env.config";

export function validateEnv() {
    if (!env.PORT) {
        throw new Error("PORT is not found in the env");
    }
    if (!env.HLS_URL) {
        throw new Error("HLS_URL is not found in the env");
    }
    if (!env.API_GATEWAY_KEY) {
        throw new Error("API_GATEWAY_KEY is not found in the env");
    }
}