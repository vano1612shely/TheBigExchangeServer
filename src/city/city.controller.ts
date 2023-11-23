import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { CityService } from "./city.service";
import { Private } from "src/guards/decorators/private.decorator";

@Controller("city")
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Get()
  async getCityList() {
    return await this.cityService.getCityList();
  }
  @Get("/withoutFormat")
  async getCityListWithoutFormat() {
    return await this.cityService.getCityListWithoutFormat();
  }
  @Private()
  @Post()
  async addCity(@Body() data) {
    return await this.cityService.addCity(data.city, data.country);
  }
  @Private()
  @Delete()
  async deleteCity(@Body() data) {
    return await this.cityService.removeCity(data.id);
  }
}
