import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { BanksService } from "./banks.service";
import { Private } from "src/guards/decorators/private.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateBank } from "./banks.types";

@Controller("banks")
export class BanksController {
  constructor(private readonly banksService: BanksService) {}
  @Get()
  async getAll() {
    return await this.banksService.getAll();
  }
  @Private()
  @Delete()
  async delete(@Body() data) {
    return await this.banksService.delete(data.id);
  }
  @Private()
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() data: CreateBank,
    // Here is it
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.banksService.create(data, file);
  }
}
