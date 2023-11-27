import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import CreateCurrencyDto from "./dto/create.currency.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("currency")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}
  @Public()
  @Get()
  async getAll() {
    return await this.currencyService.getAll();
  }
  @Public()
  @Get("/crypto")
  async getCrypto() {
    return await this.currencyService.getCrypto();
  }
  @Public()
  @Get("/fiat")
  async getFiat() {
    return await this.currencyService.getFiat();
  }
  @Delete()
  async delete(@Body() data) {
    return await this.currencyService.delete(data.id);
  }
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Body() data: CreateCurrencyDto,
    // Here is it
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.currencyService.create(data, file);
  }
  @Patch()
  async updatePercent(@Body() data) {
    console.log(data);
    return await this.currencyService.updatePercent(data.id, data.percent);
  }
}
