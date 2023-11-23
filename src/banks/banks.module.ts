import { Module } from "@nestjs/common";
import { BanksService } from "./banks.service";
import { BanksController } from "./banks.controller";
import { DatabaseModule } from "src/database/database.module";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
