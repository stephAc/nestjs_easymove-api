import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import HistoryPay from "./historyPay.entity";
import { Repository } from "typeorm";
import User from "../user/user.entity";

@Injectable()
export class HistoryPayService {
    public constructor(
        @InjectRepository(HistoryPay)
        private readonly historyPayRepository: Repository<HistoryPay>,
    ) {}

    public async save(historyPay: HistoryPay): Promise<HistoryPay> {
        return await this.historyPayRepository.save(historyPay);
    }

    public async index(user: User): Promise<HistoryPay[]> {
        return await this.historyPayRepository.find({
            where: { user: user.id },
            order: {
                createdAt: "DESC",
            },
        });
    }
}
