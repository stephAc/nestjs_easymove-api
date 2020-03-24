import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { HistoryModule } from "./history/history.module";
import { UserModule } from "./user/user.module";

const envFilePath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath }),
        TypeOrmModule.forRoot(),
        UserModule,
        AuthModule,
        HistoryModule,
    ],
})
export class AppModule {}
