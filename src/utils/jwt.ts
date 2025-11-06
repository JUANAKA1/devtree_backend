import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../config/env.config";

export const createAccessToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
  return token;
};
