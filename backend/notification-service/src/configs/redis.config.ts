import Redis from "ioredis";
import { env } from "./env.config";

const redisClient = new Redis(env.REDIS_URL as string);

redisClient.on("error", (err) => console.error("Redis error", err));

redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});

export default redisClient;
