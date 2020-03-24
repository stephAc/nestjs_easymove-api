import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { MoreThanOrEqual, Repository } from "typeorm";
import { HISTORY_ITEMS_PER_PAGE } from "./history.constant";
import History, { HistoryFilter } from "./history.entity";

@Injectable()
export class HistoryService {
    public constructor(
        @InjectRepository(History)
        private readonly historyRepository: Repository<History>,
    ) {}

    public async getPerPage(
        userId: string,
        filter: HistoryFilter,
        page: number,
    ): Promise<[History[], number]> {
        const itemsToSkip = (page - 1) * HISTORY_ITEMS_PER_PAGE;
        const limitDate = this.getLimitDateForFilter(filter);

        return await this.historyRepository.findAndCount({
            take: HISTORY_ITEMS_PER_PAGE,
            skip: itemsToSkip,
            order: {
                createdAt: "DESC",
            },
            where: { user: userId, createdAt: MoreThanOrEqual(limitDate) },
        });
    }

    public async save(historyList: History[]): Promise<History[]> {
        return await this.historyRepository.save(historyList);
    }

    private getLimitDateForFilter(filter: HistoryFilter): Date {
        const limitDate = moment();

        switch (filter) {
            case HistoryFilter.DAILY:
                limitDate.subtract("1", "day");
                break;
            case HistoryFilter.MONTHLY:
                limitDate.subtract("1", "month");
                break;
            default:
                limitDate.subtract("1", "year");
                break;
        }

        return limitDate.toDate();
    }
}
