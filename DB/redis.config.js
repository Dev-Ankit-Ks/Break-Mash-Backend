import redis from "express-redis-cache";
import "dotenv/config";
const redisCache = redis({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || "localhost",
  prefix: "master_backend",
  expire: 60 * 60,
});
redisCache.on("connected", () => {
  console.log("✅ Redis connected successfully!");
});

redisCache.on("disconnected", () => {
  console.warn("⚠️ Redis disconnected!");
});

redisCache.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redisCache;
