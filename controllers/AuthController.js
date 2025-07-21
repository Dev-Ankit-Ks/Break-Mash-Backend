import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { empty } from "@prisma/client/runtime/library";
import { sendMail } from "../config/mailer.js";
import { Logger, loggers } from "winston";
import { messages } from "@vinejs/vine/defaults";
import logger from "../config/logger.js";
class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        return res.status(400).json({
          error: {
            email: "Email is exist",
          },
        });
      }

      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.users.create({
        data: payload,
      });

      return res.json({
        status: 200,
        user,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          error: "Something went wrong. Please try again later.",
          details: error.message,
        });
      }
    }
  }
  static async login(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      const findUser = await prisma.users.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (findUser) {
        const isPasswordCorrect = bcrypt.compareSync(
          payload.password,
          findUser.password
        );
        if (!isPasswordCorrect) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        const tokenPayload = {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          profile: findUser.profile,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_TOKEN, {
          expiresIn: "365d",
        });

        return res.status(200).json({
          details: findUser,
          token,
        });
      } else {
        return res.status(404).json({
          error: "User not found",
        });
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({
          errors: error.messages,
        });
      } else {
        return res.status(500).json({
          error: "Something went wrong. Please try again later.",
          details: error.message,
        });
      }
    }
  }

  static async sendEmail(req, res) {
    try {
      const { email } = req.body;
      const payload = {
        toEmail: email,
        subject: "hey i am just testing",
        body: "my name is ankit",
      };

      await sendMail(payload.toEmail, payload.subject, payload.body);

      return res.status(200).json({
        status: 200,
        message: "Email sent",
      });
    } catch (error) {
      logger.error("Email Error");
      return res.status(400).json({
        status: 400,
        message: "Error",
        error: error.message,
      });
    }
  }
}

export default AuthController;
