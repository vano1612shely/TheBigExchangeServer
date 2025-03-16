export interface IPair {
  giveCurrency: {
    id: number;
    title: string;
    value: string;
    type: "fiat" | "crypto";
    iconLink?: string;
  };
  getCurrency: {
    id: number;
    title: string;
    value: string;
    type: "fiat" | "crypto";
    iconLink?: string;
    percent: number;
  };
  city_id?: number;
}
