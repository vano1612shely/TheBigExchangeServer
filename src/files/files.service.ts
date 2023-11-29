import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { v4 } from "uuid";
import { resolve } from "path";
import * as fs from "fs";
@Injectable()
export class FilesService {
  createFile(file: Express.Multer.File) {
    try {
      console.log(resolve(__dirname, "..", "static"));
      const fileExtension = file.originalname.split(".").pop();
      const fileName = v4() + "." + fileExtension;
      const filePath = resolve(__dirname, "..", "static");
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(resolve(filePath, fileName), file.buffer);
      return fileName;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  createFileFromBuffer(file: Buffer, fileName: string) {
    try {
      const filePath = resolve(__dirname, "..", "static");
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(resolve(filePath, fileName), file);
      return fileName;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
