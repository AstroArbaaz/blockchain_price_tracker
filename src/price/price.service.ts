import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Price } from "./price.entity";
import { AlertService } from "../alert/alert.service";

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private configService: ConfigService,
    private alertService: AlertService
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchAndStorePrices() {
    const chains = ["ethereum", "polygon"];
    for (const chain of chains) {
      const price = await this.fetchPrice(chain);
      await this.storePrice(chain, price);
      await this.checkPriceIncrease(chain, price);
      await this.alertService.checkAndTriggerAlerts(chain, price);
    }
  }

  private async fetchPrice(chain: string): Promise<number> {
    const apiKey = this.configService.get("moralis.apiKey");
    const response = await axios.get(
      `https://deep-index.moralis.io/api/v2/${chain}/price`,
      {
        headers: { "X-API-Key": apiKey },
      }
    );
    return response.data.usdPrice;
  }

  private async storePrice(chain: string, price: number) {
    const priceEntity = new Price();
    priceEntity.chain = chain;
    priceEntity.price = price;
    priceEntity.timestamp = new Date();
    await this.priceRepository.save(priceEntity);
  }

  private async checkPriceIncrease(chain: string, currentPrice: number) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oldPrice = await this.priceRepository.findOne({
      where: { chain, timestamp: oneHourAgo },
      order: { timestamp: "DESC" },
    });

    if (oldPrice) {
      const increasePercentage =
        ((currentPrice - oldPrice.price) / oldPrice.price) * 100;
      if (increasePercentage > 3) {
        await this.alertService.sendPriceAlert(
          chain,
          currentPrice,
          increasePercentage
        );
      }
    }
  }

  async getPricesLastXHours(hours: number) {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.priceRepository.find({
      where: { timestamp: startTime },
      order: { timestamp: "DESC" },
    });
  }
}
