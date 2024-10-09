import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { AlertService } from "./alert.service";

@ApiTags("alerts")
@Controller("alerts")
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  @ApiOperation({ summary: "Set a price alert" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        chain: { type: "string", example: "ethereum" },
        price: { type: "number", example: 1000 },
        email: { type: "string", example: "user@example.com" },
      },
    },
  })
  async setAlert(
    @Body() alertData: { chain: string; price: number; email: string }
  ) {
    return this.alertService.setAlert(
      alertData.chain,
      alertData.price,
      alertData.email
    );
  }
}
