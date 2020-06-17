import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Navigo from "./navigo.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Navigo])],
    controllers: [],
    providers: [],
    exports: [],
})
export class TicketModule {}
