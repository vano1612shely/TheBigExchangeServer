import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { IAddress } from "./address.interface";

@Injectable()
export class AddressService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getAll() {
    const res = await this.databaseService.address.findMany();
    return res;
  }

  async create(data: IAddress) {
    const res = await this.databaseService.address.create({
      data: {
        address: data.address,
        region: data.region,
        city_name: data.city_name,
      },
    });
    return res;
  }
  async delete(id: number) {
    const res = await this.databaseService.address.delete({
      where: { id: id },
    });
    return res;
  }
}
