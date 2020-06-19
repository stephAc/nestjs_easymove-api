import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import Ticket from "./ticket.entity";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Ticket]), UserModule],
    controllers: [TicketController],
    providers: [TicketService],
    exports: [],
})
export class TicketModule {}
