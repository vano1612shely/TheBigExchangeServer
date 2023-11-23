import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrencyController } from "./currency.controller";
import { DatabaseModule } from "src/database/database.module";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
