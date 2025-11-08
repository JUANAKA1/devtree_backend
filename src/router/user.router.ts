import { Router } from "express";
import {
  getUserByHandle,
  getUserProfile,
  updateProfile,
  updateProfileImage,
} from "../controllers/user.controller";
import { userProfileSchema } from "../schemas/user.schema";
import { validateSchema } from "../middlewares/validator.middleware";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getUserProfile);
router.patch(
  "/",
  validateSchema(userProfileSchema),
  authenticate,
  updateProfile
);
router.post("/image", authenticate, updateProfileImage);
router.get("/:handle", getUserByHandle);

export default router;
