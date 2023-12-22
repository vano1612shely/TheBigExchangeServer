import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ChainService } from "./chain.service";
import { Public } from "src/guards/decorators/public.decorator";

@Controller("chain")
export class ChainController {
  constructor(private readonly chainService: ChainService) {}

  @Post()
  async create(@Body() data) {
    return await this.chainService.create(data.name, data.currencyList);
  }
  @Public()
  @Get("/getChainsByCurrency")
  async getChainsByCurrency(@Query("currencyId") currencyId) {
    if (currencyId)
      return await this.chainService.getChainsByCurrency(Number(currencyId));
    return;
  }
  @Public()
  @Get()
  async getChains() {
    return await this.chainService.getChains();
  }
  @Public()
  @Get("/getById")
  async getChain(@Query("id") id) {
    if (id) return await this.chainService.getChain(Number(id));
    return;
  }

  @Delete("/deleteLink")
  async deleteLink(@Body() data) {
    return await this.chainService.removeCurrencyChainLink(
      data.currencyId,
      data.chainId,
    );
  }

  @Post("/addLink")
  async addLink(@Body() data) {
    return await this.chainService.addCurrencyChainLink(
      data.currencyId,
      data.chainId,
    );
  }

  @Delete()
  async delete(@Body() data) {
    return await this.chainService.delete(data.id);
  }

  @Patch()
  async update(@Body() data) {
    return await this.chainService.update(data.id, data.name);
  }
}
