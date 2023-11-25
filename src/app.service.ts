import { Injectable } from "@nestjs/common";
import axios from "axios";
import { IPair } from "./price.interface";
import { InfoService } from "./info/info.service";
import { IMessageData } from "./message.interface";
import { ClientService } from "./client/client.service";
import { IClient, IClientRequest } from "./client/client-service.interface";

@Injectable()
export class AppService {
  constructor(
    private readonly infoService: InfoService,
    private readonly clientService: ClientService,
  ) {}
  addPercent(sum, percent) {
    return sum - (sum / 100) * percent;
  }
  async getPrice(pair: IPair) {
    try {
      const exchangeRate = await this.infoService.getUahCourse();
      console.log(exchangeRate);
      const percent = await this.infoService.getPercent();
      let symbol;
      let price = 0;
      if (
        (pair.giveCurrency.value.toLowerCase() == "usd" &&
          pair.getCurrency.value.toLowerCase() == "usdt") ||
        (pair.giveCurrency.value.toLowerCase() == "usdt" &&
          pair.getCurrency.value.toLowerCase() == "usd")
      ) {
        price = 1;
        symbol = "USDTUSD";
        return {
          price: this.addPercent(price, percent),
          symbol: symbol,
        };
      }
      if (
        pair.giveCurrency.value.toLowerCase() == "usdt" &&
        pair.getCurrency.value.toLowerCase() == "uah"
      ) {
        price = exchangeRate;
        symbol = "USDUAH";
        return {
          price: this.addPercent(price, percent),
          symbol: symbol,
        };
      }
      if (
        pair.giveCurrency.value.toLowerCase() == "uah" &&
        pair.getCurrency.value.toLowerCase() == "usdt"
      ) {
        price = 1 / exchangeRate;
        symbol = "UAHUSD";
        return {
          price: this.addPercent(price, percent),
          symbol: symbol,
        };
      }
      if (pair.giveCurrency.type == "fiat") {
        symbol = `${pair.getCurrency.value.toUpperCase()}USDT`;
      } else if (pair.getCurrency.type == "fiat") {
        symbol = `${pair.giveCurrency.value.toUpperCase()}USDT`;
      }
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
      );
      console.log(response.data);
      if (
        pair.getCurrency.type == "fiat" &&
        pair.getCurrency.value.toLowerCase() !== "usd"
      ) {
        price = response.data.price * exchangeRate;
      } else if (
        pair.getCurrency.type == "fiat" &&
        pair.getCurrency.value.toLowerCase() == "usd"
      ) {
        price = response.data.price;
      }
      if (
        pair.giveCurrency.type == "fiat" &&
        pair.giveCurrency.value.toLowerCase() !== "usd"
      ) {
        price = 1 / response.data.price / exchangeRate;
      } else if (
        pair.giveCurrency.type == "fiat" &&
        pair.giveCurrency.value.toLowerCase() == "usd"
      ) {
        price = 1 / response.data.price;
      }
      return {
        price: this.addPercent(price, percent),
        symbol: symbol,
      };
    } catch (e) {
      console.log(e.response.data);
      return e.response.data;
    }
  }
  async sendMessage(messageData: IMessageData) {
    const telegram = await this.infoService.getBotData();
    await this.saveClientData(messageData);
    let message = `Нова заявка\n`;
    message += `Ім'я:${messageData.name}\n`;
    message += `Телефон: ${messageData.phone}\n`;
    message += `Telegram: ${messageData.telegram}\n`;
    message += `Пошта: ${messageData.email}\n`;
    message += `Тип: ${messageData.type === "locale" ? "Нал\n" : "Безнал\n"}`;
    message += `${messageData.city ? `Місто: ${messageData.city}\n` : ""}`;
    message += `Віддає: ${messageData.giveCurrency.value}, кількість: ${messageData.giveSum}\n`;
    message += `Отримує: ${messageData.getCurrency.value}, кількість: ${messageData.getSum}\n`;
    message += `Курс: ${messageData.exchange}\n`;
    message += `${
      messageData.walletType ? `Банк: ${messageData.walletType}\n` : ""
    }`;
    message += `Гаманець: ${messageData.wallet}\n`;
    console.log(message);
    if (telegram.telegramBotApi && telegram.telegramChatId) {
      const res = await axios.post(
        `https://api.telegram.org/bot${telegram.telegramBotApi}/sendMessage`,
        {
          chat_id: telegram.telegramChatId,
          text: message,
        },
      );
      if (res.data.ok) {
        return true;
      }
      return false;
    }
    return false;
  }
  async saveClientData(data: IMessageData) {
    const {
      name,
      telegram,
      phone,
      email,
      giveCurrency,
      getCurrency,
      getSum,
      giveSum,
      exchange,
    } = data;
    const client: IClient = { name, telegram, phone, email };
    const clientRes = await this.clientService.addClient(client);
    const requestData: IClientRequest = {
      client_id: clientRes.id,
      giveCurrency: giveCurrency.title,
      getCurrency: getCurrency.title,
      getSum,
      giveSum,
      exchange,
    };
    const request = await this.clientService.addClientRequest(requestData);
    return request;
  }
}
