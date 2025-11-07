import express from "express";
import authRouter from "./router/auth.router";
import userRouter from "./router/user.router";
import { connectDB } from "./db/mongo.db";
import cors from "cors";
// import { corsConfig } from "./config/cors.config";

connectDB();
const app = express();

app.use(express.json());
// app.use(cors(corsConfig));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

export default app;
