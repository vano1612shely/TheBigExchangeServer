import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import CreateCurrencyDto from "./dto/create.currency.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Private } from "src/guards/decorators/private.decorator";

@Controller("currency")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Get()
  async getAll() {
    return await this.currencyService.getAll();
  }
  @Get("/crypto")
  async getCrypto() {
    return await this.currencyService.getCrypto();
  }
  @Get("/fiat")
  async getFiat() {
    return await this.currencyService.getFiat();
  }
  @Private()
  @Delete()
  async delete(@Body() data) {
    return await this.currencyService.delete(data.id);
  }
  @Private()
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() data: CreateCurrencyDto,
    // Here is it
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.currencyService.create(data, file);
  }
}
