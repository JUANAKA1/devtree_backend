import { CorsOptions } from "cors";
import { ENV } from "./env.config";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === ENV.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Origen de CORS no permitido por el servidor."));
    }
  },
};
