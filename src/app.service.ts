import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { IPair } from "./price.interface";
import { InfoService } from "./info/info.service";
import { IMessageData } from "./message.interface";
import { ClientService } from "./client/client.service";
import { CurrencyService } from "./currency/currency.service";
import { CityService } from "./city/city.service";
import { DatabaseService } from "./database/database.service";

@Injectable()
export class AppService {
  constructor(
    private readonly infoService: InfoService,
    private readonly clientService: ClientService,
    private readonly currencyService: CurrencyService,
    private readonly cityService: CityService,
    private readonly databaseService: DatabaseService,
  ) {}

  private exchangeRates = [];

  addPercent(sum, percent, cityPercent) {
    if (cityPercent) {
      return sum - (sum / 100) * cityPercent;
    }
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
      return 1 / targetRate;
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
      let cityPercent = null;
      if (pair.city_id)
        cityPercent = await this.cityService.getPercent(Number(pair.city_id));
      const currencyRes = await axios.get(
        "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json",
      );
      this.exchangeRates = currencyRes.data;

      let price = 0;

      const give = pair.giveCurrency.value.toLowerCase();
      const take = pair.getCurrency.value.toLowerCase();
      const giveType = pair.giveCurrency.type;
      const takeType = pair.getCurrency.type;

      // 1. Якщо обмінюються однакові валюти або USD ⇄ USDT → курс = 1
      if (
        give === take ||
        (give === "usd" && take === "usdt") ||
        (give === "usdt" && take === "usd")
      ) {
        price = 1;
        return { price: this.addPercent(price, percent, cityPercent) };
      }
      if (
        (giveType === "fiat" && takeType === "fiat") ||
        ((giveType === "fiat" || takeType === "fiat") &&
          (give === "usdt" || take === "usdt"))
      ) {
        if (give === "usdt") {
          price = this.calculateExchangeRate("USD", take.toUpperCase());
        } else if (take === "usdt") {
          price = this.calculateExchangeRate(give.toUpperCase(), "USD");
        } else {
          price = this.calculateExchangeRate(
            give.toUpperCase(),
            take.toUpperCase(),
          );
        }
        return { price: this.addPercent(price, percent, cityPercent) };
      }

      // 3. Якщо Fiat → Crypto, беремо курс до USDT
      if (giveType === "fiat") {
        return await this.getCryptoPrice(
          take.toUpperCase(),
          give.toUpperCase(),
          percent,
          true,
          cityPercent,
        );
      }

      // 4. Якщо Crypto → Fiat, беремо курс Crypto → USDT і конвертуємо в потрібну Fiat валюту
      if (takeType === "fiat") {
        return await this.getCryptoPrice(
          give.toUpperCase(),
          take.toUpperCase(),
          percent,
          false,
          cityPercent,
        );
      }

      // 5. Crypto → Crypto (наприклад BTC → ETH)
      return await this.getCryptoToCryptoPrice(
        give.toUpperCase(),
        take.toUpperCase(),
        percent,
        cityPercent,
      );
    } catch (e) {
      return { price: 1 };
    }
  }

  /**
   * Отримує курс Crypto → Fiat або Fiat → Crypto через Binance API
   */
  private async getCryptoPrice(
    crypto: string,
    fiat: string,
    percent: number,
    convert: boolean,
    cityPercent: any,
  ) {
    try {
      // Перевіряємо, чи запитана криптовалюта - це USDT (щоб уникнути зайвих запитів)
      if (crypto === "USDT") {
        return { price: this.calculateExchangeRate("USD", fiat) };
      }
      if (fiat === "USDT") {
        return await this.getCryptoToCryptoPrice(
          crypto,
          "USDT",
          percent,
          cityPercent,
        );
      }

      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${crypto}USDT`,
      );
      let price = parseFloat(response.data.price);

      if (fiat !== "USD") {
        price = this.calculatePriceInCurrency(price, fiat);
      }
      if (convert) {
        price = 1 / price;
        return { price: this.addPercent(price, percent, cityPercent) };
      }
      return { price: this.addPercent(price, percent, cityPercent) };
    } catch (e) {
      throw new HttpException(
        `Не вдалося отримати курс для ${crypto}/${fiat}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Отримує курс Crypto → Crypto (наприклад BTC → ETH)
   */
  private async getCryptoToCryptoPrice(
    give: string,
    take: string,
    percent: number,
    cityPercent: any,
  ) {
    const directSymbol = `${give}${take}`;
    const reversedSymbol = `${take}${give}`;
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${directSymbol}`,
      );
      return {
        price: this.addPercent(
          parseFloat(response.data.price),
          percent,
          cityPercent,
        ),
      };
    } catch (error) {
      if (error.response?.data?.code === -1121) {
        try {
          const reversedResponse = await axios.get(
            `https://api.binance.com/api/v3/ticker/price?symbol=${reversedSymbol}`,
          );
          return {
            price: this.addPercent(
              1 / parseFloat(reversedResponse.data.price),
              percent,
              cityPercent,
            ),
          };
        } catch (reversedError) {
          throw new HttpException(
            `Не вдалося отримати курс для ${give}/${take}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException(
        `Помилка отримання курсу ${give}/${take}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendMessage(messageData: IMessageData) {
    const telegram = await this.infoService.getBotData();
    const requestData = await this.saveClientData(messageData);
    let message = `Нова заявка\n`;
    if (requestData.id) {
      message += `ID заявки: <code>${requestData.id}</code>\n`;
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
    if (
      messageData.getType.value === "cash" ||
      messageData.giveType.value === "cash"
    )
      message += `${messageData.city ? `Місто: ${messageData.city}\n` : ""}`;
    message += `Тип: ${messageData.giveType.value} Віддає: ${messageData.giveCurrency.value}, кількість: ${messageData.giveSum}\n`;
    message += `Тип: ${messageData.getType.value} Отримує: ${messageData.getCurrency.value}, кількість: ${messageData.getSum}\n`;
    if (
      messageData.getType.value !== "cash" &&
      messageData.getCurrency.type === "fiat"
    ) {
      message += `${messageData.bank ? `Банк: ${messageData.bank}\n` : ""}`;
      message += `Гаманець: ${messageData.wallet}\n`;
    } else if (
      messageData.getType.value !== "cash" &&
      messageData.getCurrency.type === "crypto"
    ) {
      message += `${messageData.chain ? `Мережа: ${messageData.chain}\n` : ""}`;
      message += `Гаманець: ${messageData.wallet}\n`;
    }
    message += `Курс: ${messageData.exchange}\n`;
    message += `Заявка відправлена з `;
    if (messageData.from == "site") {
      message += "сайту\n";
    } else if (messageData.from == "bot") {
      message += "телеграм боту\n";
    } else if (messageData.from == "app") {
      message += "застосунку\n";
    } else {
      message += "невідомого ресурсу";
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

  async saveClientData(messageData: IMessageData) {
    const client = await this.databaseService.client.upsert({
      where: {
        phone_name_telegram: {
          phone: messageData.phone,
          name: messageData.name,
          telegram: messageData.telegram || "",
        },
      },
      update: {},
      create: {
        name: messageData.name,
        phone: messageData.phone,
        telegram: messageData.telegram,
        email: messageData.email,
        clientId: messageData.clientId,
      },
    });

    const request = await this.databaseService.clientRequest.create({
      data: {
        giveType: messageData.giveType.value,
        getType: messageData.getType.value,
        city: messageData.city,
        giveCurrency: messageData.giveCurrency.value,
        getCurrency: messageData.getCurrency.value,
        giveSum: messageData.giveSum,
        getSum: messageData.getSum,
        exchange: messageData.exchange,
        client_id: client.id,
        bank: messageData?.bank,
        chain: messageData?.chain,
        wallet: messageData?.wallet,
        from: messageData.from || "site",
        status: "IN_PROGRESS",
      },
    });

    return request;
  }
}
