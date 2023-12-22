import { Injectable } from "@nestjs/common";
import axios from "axios";
import { IPair } from "./price.interface";
import { InfoService } from "./info/info.service";
import { IMessageData } from "./message.interface";
import { ClientService } from "./client/client.service";
import { IClient, IClientRequest } from "./client/client-service.interface";
import { CurrencyService } from "./currency/currency.service";

@Injectable()
export class AppService {
  constructor(
    private readonly infoService: InfoService,
    private readonly clientService: ClientService,
    private readonly currencyService: CurrencyService,
  ) {}
  private exchangeRates = [];
  addPercent(sum, percent) {
    return sum - (sum / 100) * percent;
  }
  calculateExchangeRate(baseCurrency: string, targetCurrency: string) {
    const baseRate = this.exchangeRates.find(
      (currency) => currency.cc === baseCurrency.toUpperCase(),
    )?.rate;
    const targetRate = this.exchangeRates.find(
      (currency) => currency.cc === targetCurrency.toUpperCase(),
    )?.rate;
    if (baseCurrency.toUpperCase() === "UAH") {
      return 1 / targetRate; // UAH/USD: Ціна однієї гривні відносно долара
    }
    if (targetCurrency.toUpperCase() === "UAH") {
      return baseRate; // USD/UAH: Курс долара до гривні
    }
    return baseRate / targetRate;
  }

  calculatePriceInCurrency(priceUSD, targetCurrency) {
    const usdToTargetCurrency = this.calculateExchangeRate(
      "USD",
      targetCurrency,
    );
    if (usdToTargetCurrency === null) {
      return 0; // Якщо не вдалося знайти курс для цільової валюти
    }

    return priceUSD * usdToTargetCurrency; // Обчислення ціни криптовалюти в цільовій валюті
  }

  async getPrice(pair: IPair) {
    try {
      const percent = await this.currencyService.getPercent(
        pair.getCurrency.id,
      );
      const currencyRes = await axios.get(
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json",
      );
      this.exchangeRates = currencyRes.data;
      let symbol;
      let price = 0;
      if (
        pair.giveCurrency.value.toLowerCase() ==
          pair.getCurrency.value.toLowerCase() ||
        (pair.giveCurrency.value.toLowerCase() === "usd" &&
          pair.getCurrency.value.toLowerCase() === "usdt") ||
        (pair.giveCurrency.value.toLowerCase() === "usdt" &&
          pair.getCurrency.value.toLowerCase() === "usd")
      ) {
        price = 1;
        return {
          price: this.addPercent(price, percent),
        };
      }
      if (
        (pair.giveCurrency.type == "fiat" && pair.getCurrency.type == "fiat") ||
        pair.giveCurrency.value.toLowerCase() === "usdt" ||
        pair.getCurrency.value.toLowerCase() === "usdt"
      ) {
        if (pair.giveCurrency.value.toLowerCase() === "usdt") {
          price = this.calculateExchangeRate("USD", pair.getCurrency.value);
        } else if (pair.getCurrency.value.toLowerCase() === "usdt") {
          price = this.calculateExchangeRate(pair.giveCurrency.value, "USD");
        } else {
          price = this.calculateExchangeRate(
            pair.giveCurrency.value,
            pair.getCurrency.value,
          );
        }
        return {
          price: this.addPercent(price, percent),
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
      if (
        pair.getCurrency.type == "fiat" &&
        pair.getCurrency.value.toLowerCase() !== "usd"
      ) {
        price = this.calculatePriceInCurrency(
          response.data.price,
          pair.getCurrency.value,
        );
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
        price =
          1 /
          this.calculatePriceInCurrency(
            response.data.price,
            pair.giveCurrency.value,
          );
      } else if (
        pair.giveCurrency.type == "fiat" &&
        pair.giveCurrency.value.toLowerCase() == "usd"
      ) {
        price = 1 / response.data.price;
      }
      return {
        price: this.addPercent(price, percent),
      };
    } catch (e) {
      return {
        price: 1,
      };
    }
  }
  async sendMessage(messageData: IMessageData) {
    const telegram = await this.infoService.getBotData();
    await this.saveClientData(messageData);
    let message = `Нова заявка\n`;
    if (messageData.requestId) {
      message += `ID заявки: <code>${messageData.requestId}</code>\n`;
    }
    message += `Ім'я:${messageData.name}\n`;
    if (messageData.phone) message += `Телефон: ${messageData.phone}\n`;
    if (messageData.telegram)
      message += `Telegram: ${
        messageData.telegram.startsWith("@")
          ? messageData.telegram
          : "@" + messageData.telegram
      }\n`;
    if (messageData.email) message += `Пошта: ${messageData.email}\n`;
    if (messageData.type === "transaction") {
      message += `Тип: Переказ коштів\n`;
      message += `Тип траназції: ${messageData.transactionType}\n`;
      if (messageData.transactionType === "offline") {
        message += `Звідки: ${messageData.transactionFrom}\n`;
        message += `Куди: ${messageData.transactionTo}\n`;
      }
    } else {
      message += `Тип: ${messageData.type === "locale" ? "Нал\n" : "Безнал\n"}`;
    }
    message += `${messageData.city ? `Місто: ${messageData.city}\n` : ""}`;
    message += `Віддає: ${messageData.giveCurrency.value}, кількість: ${messageData.giveSum}\n`;
    message += `Отримує: ${messageData.getCurrency.value}, кількість: ${messageData.getSum}\n`;
    message += `Курс: ${messageData.exchange}\n`;
    if (
      messageData.type === "online" ||
      messageData.transactionType === "online"
    ) {
      if (messageData.getCurrency.type == "fiat")
        message += `${messageData.bank ? `Банк: ${messageData.bank}\n` : ""}`;
      else
        message += `${
          messageData.chain ? `Мережа: ${messageData.chain}\n` : ""
        }`;
      message += `Гаманець: ${messageData.wallet}\n`;
    }
    if (messageData.from) {
      message += `Заявка відправленна з `;
      if (messageData.from == "site") {
        message += "сайту\n";
      } else if (messageData.from == "bot") {
        message += "телеграм боту\n";
      } else {
        message += "невідомого ресурсу";
      }
    }
    if (telegram.telegramBotApi && telegram.telegramChatId) {
      const res = await axios.post(
        `https://api.telegram.org/bot${telegram.telegramBotApi}/sendMessage`,
        {
          chat_id: telegram.telegramChatId,
          text: message,
          parse_mode: "HTML",
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
      requestId,
      clientId,
      name,
      telegram,
      phone,
      email,
      giveCurrency,
      getCurrency,
      getSum,
      giveSum,
      exchange,
      from,
    } = data;
    const client: IClient = { name, telegram, phone, email, clientId };
    const clientRes = await this.clientService.addClient(client);
    const requestData: IClientRequest = {
      client_id: clientRes.id,
      giveCurrency: giveCurrency.title,
      getCurrency: getCurrency.title,
      getSum,
      giveSum,
      exchange,
      from: from,
      requestId: requestId,
    };
    const request = await this.clientService.addClientRequest(requestData);
    return request;
  }
}
