import vine, { errors } from "@vinejs/vine";
import { newsSchema } from "../validations/newsValidation.js";
import {
  generateRandomNum,
  imageValidator,
  removeImage,
  uploadImage,
} from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransform from "../transfrom/newsApiTransform.js";
import { messages } from "@vinejs/vine/defaults";
import redisCache from "../DB/redis.config.js";
import logger from "../config/logger.js";

class NewsController {
  static async index(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;
    if (page <= 0) {
      page = 1;
    }
    if (limit <= 0 || limit > 100) {
      page = 10;
    }

    const skip = (page - 1) * limit;
    const news = await prisma.news.findMany({
      take: limit,
      skip: skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true,
          },
        },
      },
    });
    const newsTransform = news?.map((item) => NewsApiTransform.transform(item));
    const totalNews = await prisma.news.count();
    const totalPages = Math.ceil(totalNews / limit);
    return res.json({
      status: 200,
      news: newsTransform,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  }

  static async store(req, res) {
    try {
      const user = req.user;

      if (!user?.id) {
        return res.status(401).json({
          message: "Unauthorized: User ID missing.",
        });
      }

      const body = req.body;
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          errors: {
            image: "Image field is required.",
          },
        });
      }

      const image = req.files.image;
      const message = imageValidator(image.size, image.mimetype);

      if (message !== null) {
        return res.status(400).json({
          errors: {
            image: message,
          },
        });
      }

      const imageName = uploadImage(image);

      payload.image = imageName;
      payload.user_id = user.id;

      const news = await prisma.news.create({
        data: payload,
      });

      redisCache.del("news_cache", (err) => {
        if (err) {
          console.error("Redis del error:", err);
        } else {
          console.log("Cache 'news_cache' cleared.");
        }
      });

      return res.status(200).json({
        message: "News created",
        data: news,
      });
    } catch (error) {
      logger.error(error?.message);
      if (error.messages) {
        return res.status(400).json({ errors: error.messages });
      }
      return res.status(500).json({
        status: 500,
        message: "Something went wrong. Please try again.",
      });
    }
  }

  static async show(req, res) {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile: true,
            },
          },
        },
      });

      const transFormNews = news ? NewsApiTransform.transform(news) : null;
      return res.json({
        status: 200,
        news: transFormNews,
      });
    } catch (error) {
      return res.status(500).json({
        messages: "internal server error",
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      console.log(user);

      const body = req.body;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      console.log(news.user_id);

      if (user.id != news.user_id) {
        return res.status(400).json({
          message: "Unauthenticed",
        });
      }
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);
      const image = req?.files.image;

      if (image) {
        const message = imageValidator(image?.size, image?.mimetype);
        if (message != null) {
          return res.status(400).json({
            errors: {
              image: message,
            },
          });
        }
        const imageName = uploadImage(image);
        payload.image = imageName;
        removeImage(news.image);
      }

      await prisma.news.update({
        data: payload,
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        message: "news updated successfullya",
      });
    } catch (error) {
      console.error(error);
      if (error.messages) {
        return res.status(400).json({ errors: error.messages });
      }
      return res.status(500).json({
        status: 500,
        message: "Something went wrong. Please try again.",
      });
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });
      console.log(user.id);
      console.log(news.id);

      if (user.id != news.user_id) {
        return res.status(401).json({
          message: "UnAuthorization",
        });
      }

      removeImage(news.image);

      await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({
        messages: "Yah Deleted",
      });
    } catch (error) {
      console.error(error);
      if (error.messages) {
        return res.status(400).json({ errors: error.messages });
      }
      return res.status(500).json({
        status: 500,
        message: "Something went wrong. Please try again.",
      });
    }
  }
}

export default NewsController;
