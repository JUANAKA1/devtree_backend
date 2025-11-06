import express from "express";
import userRouter from "./router/user.router";
import { connectDB } from "./db/mongo.db";
import cors from "cors";
// import { corsConfig } from "./config/cors.config";

connectDB();
const app = express();

app.use(express.json());
// app.use(cors(corsConfig));
app.use(cors());


app.use("/api/auth", userRouter);

export default app;
