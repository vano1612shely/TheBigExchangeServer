import { Body, Controller, Get, Patch } from "@nestjs/common";
import { InfoService } from "./info.service";
import { Private } from "src/guards/decorators/private.decorator";

@Controller("info")
export class InfoController {
  constructor(private readonly infoService: InfoService) {}
  @Get("/getAll")
  async getAllData() {
    return await this.infoService.getAllData();
  }
  @Private()
  @Get("/getAllForAdmin")
  async getAllDataForAdmin() {
    return await this.infoService.getAllDataForAdmin();
  }
  @Private()
  @Patch("/updateAll")
  async updateData(@Body() { data }) {
    return await this.infoService.updateData(data);
  }
}
