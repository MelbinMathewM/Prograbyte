import { env } from "../config/env";

export function validateEnv() {
    if (!env.PORT) {
        throw new Error("PORT is not found in the env");
    }
    if (!env.EMAIL_USER) {
        throw new Error("EMAIL_USER is not found in the env");
    }
    if (!env.EMAIL_PASS) {
        throw new Error("EMAIL_PASS is not found in the env");
    }
    if (!env.API_GATEWAY_KEY) {
        throw new Error("API_GATEWAY_KEY is not found in the env");
    }
}