import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Ticket from "./ticket.entity";
import User from "../user/user.entity";

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
    ) {}

    public async index(): Promise<Ticket[]> {
        return await this.ticketRepository.find();
    }

    public async ticketByUser(user: User): Promise<Ticket[]> {
        return await this.ticketRepository.find({ where: { user: user } });
    }

    public async save(ticket: Ticket): Promise<Ticket> {
        return await this.ticketRepository.save(ticket);
    }
}
