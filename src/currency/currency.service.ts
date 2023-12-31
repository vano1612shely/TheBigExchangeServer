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
  async getPercent(id: number) {
    const d = await this.databaseService.cryptoCurrency.findFirst({
      select: { percent: true },
      where: { id: Number(id) },
    });
    return d.percent;
  }
  async updatePercent(id: number, percent: number) {
    const res = await this.databaseService.cryptoCurrency.update({
      data: { percent: percent },
      where: { id: id },
    });
    return res;
  }
  async create(data: CreateCurrencyDto, file: Express.Multer.File) {
    let res = await this.databaseService.cryptoCurrency.create({
      data: {
        title: data.title,
        type: data.type,
        value: data.value,
        percent: Number(data.percent) ? Number(data.percent) : 0,
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
