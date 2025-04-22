import dotenv from "dotenv";

dotenv.config();

export const env = {
    get PORT() {
        return process.env.PORT;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI;
    },
    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY;
    },
    get API_GATEWAY_KEY() {
        return process.env.API_GATEWAY_KEY;
    }

}