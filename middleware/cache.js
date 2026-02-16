import redis from "../DB/redis.config.js";

const cache = (keyPrefix, ttl = 3600) => {
  return async (req, res, next) => {
    const key = `${keyPrefix}_${req.originalUrl}`;

    try {
      const cachedData = await redis.get(key);

      if (cachedData) {
        console.log("⚡ Cache HIT:", key);
        return res.json(JSON.parse(cachedData));
      }

      console.log("🐢 Cache MISS:", key);

      // Monkey patch res.json
      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        await redis.set(key, JSON.stringify(data), "EX", ttl);
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error("❌ Cache middleware error:", err.message);
      next(); // fail open
    }
  };
};

export default cache;
