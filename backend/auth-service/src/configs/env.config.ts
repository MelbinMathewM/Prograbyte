

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
    get REDIS_URL() {
        return process.env.REDIS_URL;
    },
    get API_GATEWAY_KEY() {
        return process.env.API_GATEWAY_KEY;
    },
    get AUTH_DOMAIN() {
        return process.env.AUTH_DOMAIN;
    },
    get RABBITMQ_URL() {
        return process.env.RABBITMQ_URL;
    }
}