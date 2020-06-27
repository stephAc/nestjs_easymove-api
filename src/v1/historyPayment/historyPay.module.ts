import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HistoryPayController } from "./historyPay.controller";
import HistoryPay from "./historyPay.entity";
import { HistoryPayService } from "./historyPay.service";

@Module({
    imports: [TypeOrmModule.forFeature([HistoryPay])],
    controllers: [HistoryPayController],
    providers: [HistoryPayService],
    exports: [HistoryPayService],
})
export class HistoryPayModule {}
