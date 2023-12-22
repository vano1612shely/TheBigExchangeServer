import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { ClientService } from "./client.service";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Get()
  async getClients() {
    return await this.clientService.getClients();
  }
  @Public()
  @Post("/setStatus")
  async setStatus(@Body() data) {
    return await this.clientService.setStatus(data.requestId, data.status);
  }
  @Public()
  @Get("/request")
  async getRequestById(@Body() res) {
    return await this.clientService.getRequestById(res.id);
  }
  @Public()
  @Get("/getRequestsByClientId")
  async getRequestsByClientId(@Body() data) {
    return await this.clientService.getRequestsByClientId(data.clientId);
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
