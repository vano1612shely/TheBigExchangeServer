import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { resolve } from "path";
import { AuthModule } from "./auth/auth.module";
import { InfoModule } from "./info/info.module";
import { CityModule } from "./city/city.module";
import { CurrencyModule } from "./currency/currency.module";
import { AddressModule } from "./address/address.module";
import { BanksModule } from "./banks/banks.module";
import { ClientModule } from "./client/client.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, "static"),
    }),
    DatabaseModule,
    AuthModule,
    InfoModule,
    CityModule,
    CurrencyModule,
    AddressModule,
    BanksModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
