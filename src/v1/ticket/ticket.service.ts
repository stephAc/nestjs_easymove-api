import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Ticket from "./ticket.entity";

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
    ) {}

    public async save(ticket: Ticket): Promise<Ticket> {
        return await this.ticketRepository.save(ticket);
    }
}
