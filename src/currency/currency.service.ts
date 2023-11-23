import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import CreateCurrencyDto from "./dto/create.currency.dto";
import { FilesService } from "src/files/files.service";

@Injectable()
export class CurrencyService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly filesService: FilesService,
  ) {}
  async getAll() {
    const res = await this.databaseService.cryptoCurrency.findMany();
    return res;
  }
  async getCrypto() {
    const res = await this.databaseService.cryptoCurrency.findMany({
      where: { type: "crypto" },
    });
    return res;
  }
  async getFiat() {
    const res = await this.databaseService.cryptoCurrency.findMany({
      where: { type: "fiat" },
    });
    return res;
  }
  async create(data: CreateCurrencyDto, file: Express.Multer.File) {
    let res = await this.databaseService.cryptoCurrency.create({
      data: {
        title: data.title,
        type: data.type,
        value: data.value,
      },
    });
    if (file) {
      const fileName = await this.filesService.createFile(file);
      res = await this.databaseService.cryptoCurrency.update({
        where: { id: res.id },
        data: { icon_link: fileName },
      });
    }
    return res;
  }

  async delete(id: number) {
    const res = await this.databaseService.cryptoCurrency.delete({
      where: { id: id },
    });
    return res;
  }
}
