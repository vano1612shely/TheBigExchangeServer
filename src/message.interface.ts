export interface IMessageData {
  name: string;
  city?: string;
  type: string;
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
  walletType?: string;
  telegram?: string;
  phone: string;
  email?: string;
}
