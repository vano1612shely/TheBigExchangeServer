export interface IPair {
  giveCurrency: {
    title: string;
    value: string;
    type: "fiat" | "crypto";
    iconLink?: string;
  };
  getCurrency: {
    title: string;
    value: string;
    type: "fiat" | "crypto";
    iconLink?: string;
  };
}
