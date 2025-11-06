import colors from "colors";
import { ENV } from "./config/env.config";
import app from "./server";

app.listen(ENV.PORT, () => {
  console.log(
    colors.bgBlue.magenta.italic(`Ejecutandose en el puerto: ${ENV.PORT}`)
  );
});
