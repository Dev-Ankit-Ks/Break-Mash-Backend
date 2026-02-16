// import redis from "express-redis-cache";
// import "dotenv/config";
// console.log("ENV DEBUG → REDIS_URL:", process.env.REDIS_URL);

// const redisCache = redis({
//   url: process.env.REDIS_URL,
//   prefix: "master_backend",
//   expire: 60 * 60,
// });
// redisCache.on("connected", () => {
//   console.log("✅ Redis connected successfully!");
// });

// redisCache.on("disconnected", () => {
//   console.warn("⚠️ Redis disconnected!");
// });

// redisCache.on("error", (err) => {
//   console.error("❌ Redis connection error:", err);
// });

// export default redisCache;

import Redis from "ioredis";
import "dotenv/config";

console.log("ENV DEBUG → REDIS_URL:", process.env.REDIS_URL);

const redisCache = new Redis(process.env.REDIS_URL, {
  tls: {}, // ✅ Required for Railway
});

// ✅ Attach events to INSTANCE
redisCache.on("connect", () => {
  console.log("✅ Redis connected successfully!");
});

redisCache.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redisCache;
