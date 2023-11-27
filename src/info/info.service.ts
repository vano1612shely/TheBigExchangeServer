import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { UpdateInfoType } from "./info.types";
import { InfoResponseDto, InfoResponseForAdminDto } from "./dto/info.dto";
@Injectable()
export class InfoService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getBotData() {
    const d = await this.databaseService.info.findFirst({
      select: { telegramBotApi: true, telegramChatId: true },
    });
    return d;
  }
  async updateData(data: UpdateInfoType) {
    try {
      const {
        phone,
        telegram,
        telegramBot,
        instagram,
        exchange,
        address,
        telegramBotApi,
        telegramChatId,
      } = data;
      let create = false;
      // Отримати існуючий запис Info з бази даних
      const existingInfo = await this.databaseService.info.findUnique({
        where: { id: 1 },
      }); // Заміни 'id' на відповідне поле ідентифікації

      if (!existingInfo) {
        create = true;
      }

      // Створити об'єкт для оновлення тільки переданих полів
      const updateObject: UpdateInfoType = {};

      if (phone !== undefined) {
        updateObject.phone = phone;
      }
      if (telegram !== undefined) {
        updateObject.telegram = telegram;
      }
      if (telegramBot !== undefined) {
        updateObject.telegramBot = telegramBot;
      }
      if (instagram !== undefined) {
        updateObject.instagram = instagram;
      }
      if (exchange !== undefined) {
        updateObject.exchange = exchange;
      }
      if (address !== undefined) {
        updateObject.address = address;
      }
      if (telegramBotApi !== undefined) {
        updateObject.telegramBotApi = telegramBotApi;
      }
      if (telegramChatId !== undefined) {
        updateObject.telegramChatId = telegramChatId;
      }
      let updatedInfo;
      if (create) {
        updatedInfo = await this.databaseService.info.create({
          data: updateObject,
        });
      } else {
        updatedInfo = await this.databaseService.info.update({
          where: { id: 1 },
          data: updateObject,
        });
      }
      return new InfoResponseDto(updatedInfo);
    } catch (error) {
      console.error("Помилка при оновленні даних:", error);
      return null;
    }
  }
  async getAllData() {
    const d = await this.databaseService.info.findFirst();
    return new InfoResponseDto(d);
  }
  async getAllDataForAdmin() {
    const d = await this.databaseService.info.findFirst();
    return new InfoResponseForAdminDto(d);
  }
}
