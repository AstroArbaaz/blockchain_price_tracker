import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { PriceService } from "./price.service";
import { Price } from "./price.entity";

@ApiTags("prices")
@Controller("prices")
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @ApiOperation({ summary: "Get prices for the last X hours" })
  @ApiQuery({
    name: "hours",
    type: Number,
    description: "Number of hours to fetch prices for",
    required: false,
  })
  async getPrices(@Query("hours") hours: number = 24): Promise<Price[]> {
    return this.priceService.getPricesLastXHours(hours);
  }
}
