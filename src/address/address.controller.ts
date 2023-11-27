import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { AddressService } from "./address.service";
import { IAddress } from "./address.interface";
import { regions } from "./regions";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Public()
  @Get()
  async getAll() {
    return await this.addressService.getAll();
  }
  @Post()
  async create(@Body() data: IAddress) {
    console.log(data);
    return await this.addressService.create(data);
  }
  @Delete()
  async delete(@Body() data) {
    return await this.addressService.delete(data.id);
  }
  @Public()
  @Get("/getRegions")
  async getRegions() {
    return regions;
  }
}
