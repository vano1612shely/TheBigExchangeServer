import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ChainService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(name: string, currencyList: number[]) {
    const currencies = await this.databaseService.cryptoCurrency.findMany({
      where: {
        id: {
          in: currencyList,
        },
      },
    });

    const createdChain = await this.databaseService.chain.create({
      data: {
        name: name,
        currencies: {
          connect: currencies.map((currency) => ({
            id: currency.id,
          })),
        },
      },
      include: {
        currencies: true,
      },
    });

    return createdChain;
  }

  async getChainsByCurrency(currencyId) {
    const currency = await this.databaseService.cryptoCurrency.findUnique({
      where: {
        id: currencyId,
      },
      include: {
        chains: true,
      },
    });

    if (!currency) {
      throw new Error(`Currency with ID ${currencyId} not found.`);
    }

    return currency.chains;
  }

  async getChains() {
    const res = await this.databaseService.chain.findMany({
      include: { currencies: true },
    });
    return res;
  }
  async getChain(id) {
    const res = await this.databaseService.chain.findFirst({
      where: { id: id },
      include: { currencies: true },
    });
    return res;
  }

  async removeCurrencyChainLink(currencyId: number, chainId: number) {
    const currency = await this.databaseService.cryptoCurrency.findFirst({
      where: {
        id: currencyId,
      },
      include: {
        chains: true,
      },
    });

    if (!currency) {
      throw new Error(`Currency with ID ${currencyId} not found.`);
    }

    const chainIndex = currency.chains.findIndex(
      (chain) => chain.id === chainId,
    );

    if (chainIndex === -1) {
      throw new Error(
        `Chain with ID ${chainId} is not linked to currency ${currencyId}.`,
      );
    }

    const res = await this.databaseService.chain.update({
      where: { id: chainId },
      data: {
        currencies: {
          disconnect: {
            id: currencyId,
          },
        },
      },
      include: {
        currencies: true,
      },
    });

    return res;
  }
  async addCurrencyChainLink(currencyId: number, chainId: number) {
    const currency = await this.databaseService.cryptoCurrency.findFirst({
      where: {
        id: currencyId,
      },
      include: {
        chains: true,
      },
    });

    if (!currency) {
      throw new Error(`Currency with ID ${currencyId} not found.`);
    }

    const chainExists = currency.chains.some((chain) => chain.id === chainId);

    if (chainExists) {
      throw new Error(
        `Chain with ID ${chainId} is already linked to currency ${currencyId}.`,
      );
    }

    const res = await this.databaseService.chain.update({
      where: { id: chainId },
      data: {
        currencies: {
          connect: {
            id: currencyId,
          },
        },
      },
      include: {
        currencies: true,
      },
    });

    return res;
  }
  async delete(id) {
    const res = await this.databaseService.chain.delete({ where: { id: id } });
    return res;
  }

  async update(id: number, name: string) {
    const res = await this.databaseService.chain.update({
      where: { id: id },
      data: {
        name: name,
      },
      include: {
        currencies: true,
      },
    });
    return res;
  }
}
