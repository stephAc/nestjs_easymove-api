import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.register({
            secret: "secret",
            signOptions: {
                expiresIn: "12h",
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
