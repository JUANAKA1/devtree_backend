import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { ENV } from "../config/env.config";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      return res
        .status(401)
        .json({ message: "No autorizado hace falta el token" });
    }

    const [, token] = bearer.split(" ");
    if (!token) {
      return res.status(401).json({ message: "No autorizado: token inválido" });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };

    if (!decoded?.id) {
      return res.status(401).json({ message: "Token no autorizado" });
    }

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    console.error("Error en authMiddleware:", error);
    res.status(500).json({ message: "Error de autenticación", error });
  }
};
