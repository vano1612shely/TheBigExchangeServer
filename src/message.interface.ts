export interface IMessageData {
  requestId?: string;
  clientId?: string;
  name: string;
  type: string;
  city?: string;
  getType: {
    value: string;
    label: string;
  };
  giveType: {
    value: string;
    label: string;
  };
  transactionType?: string;
  transactionFrom?: string;
  transactionTo?: string;
  giveCurrency: {
    id: number;
    title: string;
    icon_link: string | null;
    value: string;
    type: "crypto" | "fiat";
  };
  getCurrency: {
    id: number;
    title: string;
    icon_link: string | null;
    value: string;
    type: "crypto" | "fiat";
  };
  giveSum: number;
  getSum: number;
  exchange: number;
  wallet?: string;
  bank?: string;
  chain?: string;
  telegram?: string;
  phone: string;
  email?: string;
  from?: string;
}
