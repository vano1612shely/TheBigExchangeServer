export interface IClient {
  name: string;
  telegram?: string;
  phone: string;
  email?: string;
}

export interface IClientRequest {
  client_id: number;
  giveCurrency: string;
  getCurrency: string;
  giveSum: number;
  getSum: number;
  exchange: number;
}
