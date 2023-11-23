import { Module } from "@nestjs/common";
import { InfoService } from "./info.service";
import { InfoController } from "./info.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
