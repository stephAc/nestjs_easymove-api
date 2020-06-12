import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { diskStorage } from "multer";
import { MulterModule } from "@nestjs/platform-express";

import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { editFileName, imageFileFilter } from "../middleware/file.middleware";

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
        MulterModule.register({
            storage: diskStorage({
                destination: "./src/public/img",
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
