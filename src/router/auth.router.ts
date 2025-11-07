import { Router } from "express";
import { createUser, login, } from "../controllers/user.controller";
import { userLoginSchema, userRegisterSchema } from "../schemas/user.schema";
import { validateSchema } from "../middlewares/validator.middleware";


const router = Router();

router.post("/register", validateSchema(userRegisterSchema), createUser);
router.post("/login", validateSchema(userLoginSchema), login);


export default router;
