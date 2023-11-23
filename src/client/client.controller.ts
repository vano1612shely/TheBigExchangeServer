import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ClientService } from "./client.service";
import { Private } from "src/guards/decorators/private.decorator";

@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Private()
  @Get()
  async getClients() {
    return await this.clientService.getClients();
  }
  @Private()
  @Get("/fullData")
  async getClientsWithRequest() {
    return await this.clientService.getClientsWithRequest();
  }
  @Private()
  @Get("downloadClientCsv")
  async downloadCSV(@Res() res: Response) {
    const fileName = await this.clientService.downloadClientsDataCSV();
    return res.redirect("/" + fileName);
  }
  @Private()
  @Get("downloadClientExcel")
  async downloadExcel(@Res() res: Response) {
    const fileName = await this.clientService.downloadClientsDataXLSX();
    return res.redirect("/" + fileName);
  }
  @Private()
  @Get("downloadRequestCsv")
  async downloadAllDataCSV(@Res() res: Response) {
    const fileName = await this.clientService.downloadRequestDataCSV();
    return res.redirect("/" + fileName);
  }
  @Private()
  @Get("downloadRequestExcel")
  async downloadAllDataExcel(@Res() res: Response) {
    const fileName = await this.clientService.downloadRequestDataXLSX();
    return res.redirect("/" + fileName);
  }
}
