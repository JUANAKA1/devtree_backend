import colors from "colors";

import mongoose from "mongoose";
import { ENV } from "../config/env.config";


export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(ENV.MONGO_URI);
    console.log(colors.cyan.bold("MongoDB conectado"));
  } catch (error) {
    console.error("Error al conectar MongoDB ",error);
    process.exit(1);
  }
};
