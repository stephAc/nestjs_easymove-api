import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";
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

    public async findOneById(id: string): Promise<Ticket | undefined> {
        return await this.ticketRepository.findOneOrFail({
            where: { id },
            relations: ["user"],
        });
    }

    public async ticketByUser(user: User): Promise<Ticket[]> {
        return await this.ticketRepository.find({ where: { user: user } });
    }

    public async save(ticket: Ticket): Promise<Ticket> {
        return await this.ticketRepository.save(ticket);
    }

    public async update(ticket: Ticket): Promise<Ticket> {
        return await this.ticketRepository.save(ticket);
    }

    public async delete(ticket: Ticket): Promise<any> {
        return await this.ticketRepository.remove(ticket);
    }
}
