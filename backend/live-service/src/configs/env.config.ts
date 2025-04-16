import dotenv from "dotenv";

dotenv.config();

export const env = {
    get PORT() {
        return process.env.PORT;
    },
    get HLS_URL() {
        return process.env.HLS_URL;
    },
    get API_GATEWAY_KEY() {
        return process.env.API_GATEWAY_KEY;
    }
}