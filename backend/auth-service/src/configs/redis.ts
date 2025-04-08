import { createClient } from "redis";
import { env } from "./env.config";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

export default redisClient;
