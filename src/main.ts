import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
  await app.listen(5000);
}
bootstrap();
