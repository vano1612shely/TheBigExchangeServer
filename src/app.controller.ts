import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { IPair } from "./price.interface";
import { Public } from "./guards/decorators/public.decorator";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get("/price")
  async getData(@Query() pair: IPair) {
    return this.appService.getPrice(pair);
  }

  @Post("/sendMessage")
  async sendMessage(@Body() data) {
    return this.appService.sendMessage(data);
  }
}
