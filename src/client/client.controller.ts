import { Controller, Get, Res } from "@nestjs/common";
import { Response } from "express";
import { ClientService } from "./client.service";

@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Get()
  async getClients() {
    return await this.clientService.getClients();
  }
  @Get("/fullData")
  async getClientsWithRequest() {
    return await this.clientService.getClientsWithRequest();
  }
  @Get("downloadClientCsv")
  async downloadCSV(@Res() res: Response) {
    const fileName = await this.clientService.downloadClientsDataCSV();
    return res.redirect("/" + fileName);
  }
  @Get("downloadClientExcel")
  async downloadExcel(@Res() res: Response) {
    const fileName = await this.clientService.downloadClientsDataXLSX();
    return res.redirect("/" + fileName);
  }
  @Get("downloadRequestCsv")
  async downloadAllDataCSV(@Res() res: Response) {
    const fileName = await this.clientService.downloadRequestDataCSV();
    return res.redirect("/" + fileName);
  }
  @Get("downloadRequestExcel")
  async downloadAllDataExcel(@Res() res: Response) {
    const fileName = await this.clientService.downloadRequestDataXLSX();
    return res.redirect("/" + fileName);
  }
}
