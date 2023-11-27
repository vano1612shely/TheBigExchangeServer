import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { CityService } from "./city.service";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("city")
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Public()
  @Get()
  async getCityList() {
    return await this.cityService.getCityList();
  }
  @Public()
  @Get("/withoutFormat")
  async getCityListWithoutFormat() {
    return await this.cityService.getCityListWithoutFormat();
  }
  @Post()
  async addCity(@Body() data) {
    return await this.cityService.addCity(data.city, data.country);
  }
  @Delete()
  async deleteCity(@Body() data) {
    return await this.cityService.removeCity(data.id);
  }
}
