export const env = {
    get PORT() {
        return process.env.PORT;
    },
    get EMAIL_USER() {
        return process.env.EMAIL_USER;
    },
    get EMAIL_PASS() {
        return process.env.EMAIL_PASS;
    },
    get API_GATEWAY_KEY() {
        return process.env.API_GATEWAY_KEY;
    },

}