import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { DatabaseModule } from "src/database/database.module";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
