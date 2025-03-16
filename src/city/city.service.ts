import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class CityService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getCityList() {
    const citiesByCountry = await this.databaseService.city.findMany({
      select: {
        id: true,
        country: true,
        city_name: true,
      },
      orderBy: [{ country: "asc" }, { city_name: "asc" }],
    });
    const groupedCities = citiesByCountry.reduce((acc, city) => {
      if (!acc[city.country]) {
        acc[city.country] = [];
      }
      acc[city.country].push(city);
      return acc;
    }, {});
    return groupedCities;
  }
  async getCityListWithoutFormat() {
    const cityList = await this.databaseService.city.findMany();
    return cityList;
  }

  async getPercent(id: number) {
    const data = await this.databaseService.city.findMany({
      where: {
        id: id,
      },
    });
    return data[0].percent;
  }
  async addCity(cityName: string, country: string, percent?: number) {
    const cityList = await this.databaseService.city.create({
      data: { city_name: cityName, country: country, percent: percent || 0 },
    });
    return cityList;
  }
  async removeCity(id: number) {
    const cityList = await this.databaseService.city.delete({
      where: { id: id },
    });
    return cityList;
  }
}
