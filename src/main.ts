import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { resolve } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
