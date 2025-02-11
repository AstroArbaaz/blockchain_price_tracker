import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PriceService } from "./price.service";
import { PriceController } from "./price.controller";
import { Price } from "./price.entity";
import { AlertModule } from "../alert/alert.module";

@Module({
  imports: [TypeOrmModule.forFeature([Price]), AlertModule],
  providers: [PriceService],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {}
