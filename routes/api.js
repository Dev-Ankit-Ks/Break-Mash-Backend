import express from "express";
import AuthController from "../controllers/AuthController.js";
import ProfileController from "../controllers/ProfileController.js";
import authMiddleware from "../middleware/Authenticate.js";
import NewsController from "../controllers/NewsController.js";
import redisCache from "../DB/redis.config.js";

const router = express.Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);
router.post("/send-email", AuthController.sendEmail);

// News Routes
router.get("/news", redisCache.route("news_cache"), NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;
