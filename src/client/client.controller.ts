import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { ClientService } from "./client.service";
import { Public } from "../guards/decorators/public.decorator";

@Controller("client")
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Get()
  async getClients() {
    return await this.clientService.getClients();
  }
  @Post("/setStatus")
  async setStatus(@Body() data) {
    return await this.clientService.setStatus(data.requestId, data.status);
  }

  @Get("/request")
  async getRequests(
    @Query("page") page = "1",
    @Query("per_page") perPage = "10",
  ) {
    const pageNumber = parseInt(page);
    const perPageNumber = parseInt(perPage);

    return await this.clientService.getRequests({
      page: pageNumber,
      perPage: perPageNumber,
    });
  }
  @Public()
  @Get("/requestForCustomer/:id")
  async getRequestByUUID(@Param() { id }: { id: string }) {
    if (!id) {
      return null;
    }
    const result = await this.clientService.getRequestByUUID(id);
    return result;
  }
  @Get("/request/:id")
  async getRequestById(@Param() { id }: { id: string }) {
    if (!id) {
      return null;
    }
    const result = await this.clientService.getRequestById(id);
    return result;
  }
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
