export default class CreateCurrencyDto {
  constructor(model) {
    this.title = model?.title;
    this.value = model?.value;
    this.type = model?.type;
  }
  title: string;
  value: string;
  type: string;
  percent?: number;
}
