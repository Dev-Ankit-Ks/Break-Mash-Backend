import { messages } from "@vinejs/vine/defaults";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader == null || authHeader == undefined) {
    return res.status(401).json({
      status: 401,
      messages: "UnAuthorized",
    });
  }

  jwt.verify(authHeader, process.env.JWT_TOKEN, (err, user) => {
    if (err)
      return res.status(401).json({ status: 401, messages: "UnAuthorized" });
    req.user = user;
    next();
  });
};

export default authMiddleware;
