import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Navigo from "./navigo.entity";
import { NavigoService } from "./navigo.service";
import { NavigoController } from "./navigo.controller";
import { UserModule } from "../user/user.module";
import { HistoryPayModule } from "../historyPayment/historyPay.module";

@Module({
    imports: [TypeOrmModule.forFeature([Navigo]), UserModule, HistoryPayModule],
    controllers: [NavigoController],
    providers: [NavigoService],
    exports: [],
})
export class NavigoModule {}
