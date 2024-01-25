import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import { readFileSync } from "fs";
async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(
      "/etc/letsencrypt/live/thebigexchange.net-0001/privkey.pem",
    ),
    cert: readFileSync(
      "/etc/letsencrypt/live/thebigexchange.net-0001/fullchain.pem",
    ),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.enableCors();
  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
  await app.listen(5000);
}
bootstrap();
