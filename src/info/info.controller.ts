import { Body, Controller, Get, Patch } from "@nestjs/common";
import { InfoService } from "./info.service";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("info")
export class InfoController {
  constructor(private readonly infoService: InfoService) {}
  @Public()
  @Get("/getAll")
  async getAllData() {
    return await this.infoService.getAllData();
  }
  @Get("/getAllForAdmin")
  async getAllDataForAdmin() {
    return await this.infoService.getAllDataForAdmin();
  }

  @Patch("/updateAll")
  async updateData(@Body() { data }) {
    return await this.infoService.updateData(data);
  }
}
