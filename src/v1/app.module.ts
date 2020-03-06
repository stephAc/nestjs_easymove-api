import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

const envFilePath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath }),
        TypeOrmModule.forRoot(),
        UserModule,
        AuthModule
    ],
})
export class AppModule {}
