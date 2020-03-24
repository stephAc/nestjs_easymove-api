import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HistoryController } from "./history.controller";
import History from "./history.entity";
import { HistoryService } from "./history.service";

@Module({
    imports: [TypeOrmModule.forFeature([History])],
    controllers: [HistoryController],
    providers: [HistoryService],
})
export class HistoryModule {}
