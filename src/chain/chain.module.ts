import { Module } from "@nestjs/common";
import { ChainService } from "./chain.service";
import { ChainController } from "./chain.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [ChainController],
  providers: [ChainService],
  exports: [ChainService],
})
export class ChainModule {}
