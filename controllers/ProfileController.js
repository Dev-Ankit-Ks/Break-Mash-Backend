import prisma from "../DB/db.config.js";
import { generateRandomNum, imageValidator } from "../utils/helper.js";

class ProfileController {
  static async index(req, res) {
    try {
      const freshUser = await prisma.users.findUnique({
        where: { id: req.user.id },
      });

      return res.json({
        status: 200,
        user: {
          ...freshUser,
          profile: freshUser.profile
            ? `http://localhost:5000${freshUser.profile}`
            : null,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;

      if (!req.files || Object.keys(req.files).length == 0) {
        return res
          .status(400)
          .json({ status: 400, message: "Profile image is required." });
      }

      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile.mimetype);

      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }

      const imgExt = profile?.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
      const uploadPath = process.cwd() + "/public/images/" + imageName;
      await profile.mv(uploadPath);

      await prisma.users.update({
        data: {
          profile: `/images/${imageName}`,
        },
        where: {
          id: Number(id),
        },
      });

      return res.json({
        status: 200,
        message: "Profile updated successfully!",
      });
    } catch (error) {
      console.log("The error is", error);
      return res
        .status(500)
        .json({ message: "Something went wrong.please try again!" });
    }
  }
}

export default ProfileController;
