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
    }
}