import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { IAddress } from "./address.interface";
import { regions } from "./regions";
import { Private } from "src/guards/decorators/private.decorator";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Get()
  async getAll() {
    return await this.addressService.getAll();
  }
  @Private()
  @Post()
  async create(@Body() data: IAddress) {
    console.log(data);
    return await this.addressService.create(data);
  }
  @Private()
  @Delete()
  async delete(@Body() data) {
    return await this.addressService.delete(data.id);
  }
  @Get("/getRegions")
  async getRegions() {
    return regions;
  }
}
