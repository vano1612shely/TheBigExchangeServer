import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { DatabaseModule } from "src/database/database.module";
import { FilesModule } from "src/files/files.module";

@Module({
  imports: [FilesModule, DatabaseModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
