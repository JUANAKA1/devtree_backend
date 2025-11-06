import { Router } from "express";
import { createUser, getUserProfile, login } from "../controllers/user.controller";
import { userLoginSchema, userRegisterSchema } from "../schemas/user.schema";
import { validateSchema } from "../middlewares/validator.middleware";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.post("/register", validateSchema(userRegisterSchema), createUser);
router.post("/login", validateSchema(userLoginSchema), login);
router.get("/user",authenticate, getUserProfile);

export default router;
