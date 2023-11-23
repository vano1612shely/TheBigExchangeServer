export class InfoResponseDto {
  constructor(model) {
    this.phone = model?.phone;
    this.telegram = model?.telegram;
    this.telegramBot = model?.telegramBot;
    this.instagram = model?.instagram;
    this.address = model?.address;
    this.exchange = model?.exchange;
  }
  phone;
  telegram;
  telegramBot;
  instagram;
  address;
  exchange;
}

export class InfoResponseForAdminDto {
  constructor(model) {
    this.phone = model?.phone;
    this.telegram = model?.telegram;
    this.telegramBot = model?.telegramBot;
    this.instagram = model?.instagram;
    this.address = model?.address;
    this.exchange = model?.exchange;
    this.percent = model?.percent;
    this.telegramBotApi = model?.telegramBotApi;
    this.telegramChatId = model?.telegramChatId;
  }
  phone;
  telegram;
  telegramBot;
  instagram;
  address;
  exchange;
  percent;
  telegramBotApi;
  telegramChatId;
}
