export const env = {
    get PORT() {
        return process.env.PORT;
    },
    get MONGO_URI() {
        return process.env.MONGO_URI;
    },
    get JWT_ACCESS_SECRET() {
        return process.env.JWT_ACCESS_SECRET;
    },
    get JWT_REFRESH_SECRET() {
        return process.env.JWT_REFRESH_SECRET;
    },
    get GOOGLE_CLIENT_ID() {
        return process.env.GOOGLE_CLIENT_ID;
    },
    get GOOGLE_CLIENT_SECRET() {
        return process.env.GOOGLE_CLIENT_SECRET;
    },
    get BACKEND_URL() {
        return process.env.BACKEND_URL;
    },
    get FRONTEND_URL() {
        return process.env.FRONTEND_URL;
    },
    get RABBITMQ_URL() {
        return process.env.RABBITMQ_URL;
    },
    get API_GATEWAY_KEY() { 
        return process.env.API_GATEWAY_KEY; 
    },
    get SESSION_SECRET_KEY() {
        return process.env.SESSION_SECRET_KEY;
    },
    get STRIPE_SECRET_KEY() {
        return process.env.STRIPE_SECRET_KEY
    },
    get STRIPE_WEBHOOK_SECRET() {
        return process.env.STRIPE_WEBHOOK_SECRET
    }
}