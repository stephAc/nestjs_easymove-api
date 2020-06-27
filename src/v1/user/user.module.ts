import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import User from "./user.entity";
import { UserService } from "./user.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../middleware/file.middleware";
import { HistoryPayModule } from "../historyPayment/historyPay.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MulterModule.register({
            storage: diskStorage({
                destination: "./src/public/img",
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
        HistoryPayModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
