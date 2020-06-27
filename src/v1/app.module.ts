import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { HistoryModule } from "./history/history.module";
import { UserModule } from "./user/user.module";
import { TicketModule } from "./ticket/ticket.module";
import { NavigoModule } from "./navigo/navigo.module";
import { HistoryPayModule } from "./historyPayment/historyPay.module";

const envFilePath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath }),
        TypeOrmModule.forRoot(),
        UserModule,
        AuthModule,
        HistoryModule,
        TicketModule,
        NavigoModule,
        HistoryPayModule,
    ],
})
export class AppModule {}
