import dotenv from "dotenv";

dotenv.config();

export const env = {
    get PORT() {
        return process.env.PORT;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI;
    },
    get CLOUDINARY_CLOUD_NAME() {
        return process.env.CLOUDINARY_CLOUD_NAME;
    },
    get CLOUDINARY_API_KEY() {
        return process.env.CLOUDINARY_API_KEY;
    },
    get CLOUDINARY_API_SECRET() {
        return process.env.CLOUDINARY_API_SECRET;
    },
    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY;
    },
    get API_GATEWAY_KEY() {
        return process.env.API_GATEWAY_KEY;
    },
    get TOKEN_SECRET() {
        return process.env.TOKEN_SECRET;
    },
    get RABBITMQ_URL() {
        return process.env.RABBITMQ_URL
    }

}