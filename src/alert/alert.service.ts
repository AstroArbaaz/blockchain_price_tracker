import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Alert } from "./alert.entity";

@Injectable()
export class AlertService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private configService: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("email.host"),
      port: this.configService.get("email.port"),
      auth: {
        user: this.configService.get("email.user"),
        pass: this.configService.get("email.pass"),
      },
    });
  }

  async sendPriceAlert(
    chain: string,
    price: number,
    increasePercentage: number
  ) {
    await this.transporter.sendMail({
      from: this.configService.get("email.user"),
      to: "hyperhire_assignment@hyperhire.in",
      subject: `Price Alert: ${chain} increased by ${increasePercentage.toFixed(
        2
      )}%`,
      text: `The price of ${chain} has increased to $${price.toFixed(
        2
      )}, which is a ${increasePercentage.toFixed(
        2
      )}% increase from one hour ago.`,
    });
  }

  async setAlert(chain: string, price: number, email: string) {
    const alert = new Alert();
    alert.chain = chain;
    alert.price = price;
    alert.email = email;
    return this.alertRepository.save(alert);
  }

  async checkAndTriggerAlerts(chain: string, currentPrice: number) {
    const alerts = await this.alertRepository.find({ where: { chain } });
    for (const alert of alerts) {
      if (
        (alert.price > currentPrice &&
          alert.lastTriggeredPrice > currentPrice) ||
        (alert.price < currentPrice && alert.lastTriggeredPrice < currentPrice)
      ) {
        await this.sendAlertEmail(alert, currentPrice);
        alert.lastTriggeredPrice = currentPrice;
        await this.alertRepository.save(alert);
      }
    }
  }

  private async sendAlertEmail(alert: Alert, currentPrice: number) {
    await this.transporter.sendMail({
      from: this.configService.get("email.user"),
      to: alert.email,
      subject: `Price Alert: ${alert.chain} reached $${currentPrice.toFixed(
        2
      )}`,
      text: `The price of ${alert.chain} has reached $${currentPrice.toFixed(
        2
      )}, triggering your alert set at $${alert.price.toFixed(2)}.`,
    });
  }
}
