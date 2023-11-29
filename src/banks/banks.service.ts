import { Injectable } from "@nestjs/common";
import { CreateBank } from "./banks.types";
import { DatabaseService } from "src/database/database.service";
import { FilesService } from "src/files/files.service";

@Injectable()
export class BanksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly filesService: FilesService,
  ) {}
  async getAll() {
    const res = await this.databaseService.banks.findMany();
    return res;
  }
  async create(data: CreateBank, file: Express.Multer.File) {
    let res = await this.databaseService.banks.create({
      data: {
        name: data.name,
      },
    });
    if (file) {
      const fileName = await this.filesService.createFile(file);
      res = await this.databaseService.banks.update({
        where: { id: res.id },
        data: { icon_link: fileName },
      });
    }
    return res;
  }

  async delete(id: number) {
    const res = await this.databaseService.banks.delete({
      where: { id: id },
    });
    return res;
  }
}
