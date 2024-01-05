import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ICreatePost, IUpdatePost } from "./post.interface";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}
  @UseInterceptors(FileInterceptor("image"))
  @Post("loadMedia")
  async loadMedia(@UploadedFile() file: Express.Multer.File) {
    return await this.postService.loadMedia(file);
  }

  @Post("create")
  async create(@Body() data: ICreatePost) {
    return await this.postService.create(data);
  }
  @Delete("")
  async delete(@Body() data) {
    return await this.postService.delete(data.id);
  }
  @Put("update")
  async update(@Body() data: IUpdatePost) {
    return await this.postService.update(data);
  }
  @Get("getPostsAdmin")
  async getPostsForAdmin(@Query("skip") skip, @Query("take") take) {
    return await this.postService.getPosts(Number(skip), Number(take), true);
  }
  @Get("postAdmin")
  async getPostForAdmin(@Query("id") id) {
    return await this.postService.getPostForAdmin(Number(id));
  }
  @Get("publish")
  async changeType(@Query("id") id) {
    return await this.postService.publish(Number(id));
  }
  @Public()
  @Get("getPosts")
  async getPosts(@Query("skip") skip, @Query("take") take) {
    return await this.postService.getPosts(Number(skip), Number(take), false);
  }
  @Public()
  @Get("/")
  async getPost(@Query("id") id) {
    return await this.postService.getPost(Number(id));
  }
  @Public()
  @Get("last")
  async getLastPost() {
    return await this.postService.getLastPost();
  }

  @Public()
  @Get("/view")
  async view(@Query("id") id) {
    return await this.postService.view(Number(id));
  }
}
