import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import { readFileSync } from "fs";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import * as express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync(
  //     "/etc/letsencrypt/live/thebigexchange.net-0001/privkey.pem",
  //   ),
  //   cert: readFileSync(
  //     "/etc/letsencrypt/live/thebigexchange.net-0001/fullchain.pem",
  //   ),
  // };
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
  createHttpServer(server).listen(5001);
  // createHttpsServer(httpsOptions, server).listen(5000);
  await app.init();
}
bootstrap();
