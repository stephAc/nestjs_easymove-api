import { Test, TestingModule } from "@nestjs/testing";
import { chunk, flatten } from "lodash";
import * as moment from "moment";
import { Repository } from "typeorm";
import { v4 } from "uuid";
import { AppModule } from "../app.module";
import User, { UserRole } from "../user/user.entity";
import { HISTORY_ITEMS_PER_PAGE } from "./history.constant";
import History, { HistoryFilter } from "./history.entity";
import { HistoryService } from "./history.service";

describe("History", () => {
    let moduleRef: TestingModule;
    let service: HistoryService;
    let repository: Repository<History>;
    let userRepository: Repository<User>;
    let user: User;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = moduleRef.get<HistoryService>(HistoryService);
        repository = moduleRef.get("HistoryRepository");
        userRepository = moduleRef.get("UserRepository") as Repository<User>;
        user = getUser();

        await userRepository.query("DELETE from users;");
        await repository.query("DELETE from history;");
        await userRepository.save(user);
    });

    describe("index", () => {
        it("should return 20 history items per page", async () => {
            const historyList = generateHistoryList(30);
            await repository.save(historyList);

            const [items, _] = await service.getPerPage(
                user.id,
                HistoryFilter.DAILY,
                1,
            );

            expect(items.length).toEqual(HISTORY_ITEMS_PER_PAGE);
        });

        it("should return remaining history items on the last page", async () => {
            const historyList = generateHistoryList(30);
            await repository.save(historyList);

            const [items, _] = await service.getPerPage(
                user.id,
                HistoryFilter.DAILY,
                2,
            );

            expect(items.length).toEqual(10);
        });

        it("should return the most recent history items first", async () => {
            const historyList = generateHistoryList(HISTORY_ITEMS_PER_PAGE);
            await repository.save(historyList);

            const [items, _] = await service.getPerPage(
                user.id,
                HistoryFilter.DAILY,
                1,
            );

            expect(items[0].createdAt).toEqual(
                historyList[historyList.length - 1].createdAt,
            );
        });

        it("should return the number of history items", async () => {
            const historyList = generateHistoryList(24);
            await repository.save(historyList);

            const [_, nbItems] = await service.getPerPage(
                user.id,
                HistoryFilter.DAILY,
                2,
            );

            expect(nbItems).toEqual(24);
        });

        afterEach(async () => {
            await repository.query(`DELETE FROM history;`);
        });
    });

    describe("filter", () => {
        const dailyDate = moment().toDate();
        const monthlyDate = moment()
            .subtract("15", "days")
            .toDate();
        const annualDate = moment()
            .subtract("3", "months")
            .toDate();
        const unscopedDate = moment()
            .subtract("2", "years")
            .toDate();

        beforeAll(async () => {
            // create sets of history with differents date
            const historyList = generateHistoryList(120);
            const historyListChunked = chunk(historyList, 35);

            // update createdAt date
            historyListChunked[0].map(h => (h.createdAt = dailyDate)); // 35 items
            historyListChunked[1].map(h => (h.createdAt = monthlyDate)); // 35 items
            historyListChunked[2].map(h => (h.createdAt = annualDate)); // 35 items
            historyListChunked[3].map(h => (h.createdAt = unscopedDate)); // 15 items

            await repository.save(flatten(historyListChunked));
        });

        it("(ANNUAL) does not count unscoped/outdated items", async () => {
            const [_, totalItems] = await service.getPerPage(
                user.id,
                HistoryFilter.ANNUAL,
                1,
            );
            expect(totalItems).toEqual(35 * 3);
        });

        it("(MONTHLY) retrieve items from day and month", async () => {
            const [_, totalItems] = await service.getPerPage(
                user.id,
                HistoryFilter.MONTHLY,
                1,
            );

            expect(totalItems).toEqual(35 * 2);
        });

        it("(DAILY) retrieve items only for current day", async () => {
            const [_, totalItems] = await service.getPerPage(
                user.id,
                HistoryFilter.DAILY,
                1,
            );

            expect(totalItems).toEqual(35);
        });

        afterAll(async () => {
            await repository.query(`DELETE FROM history;`);
        });
    });

    afterAll(async () => {
        await userRepository.query("DELETE from users;");
        await moduleRef.close();
    });

    const getUser = (): User => {
        return {
            id: v4(),
            email: "user@user.com",
            username: "user",
            password:
                "$2b$10$oUXojGO13JHfqSlV9zAy5eUkS2xI/Lu63ZUUuiTMO2B8W8dNB2vjy", // password
            role: UserRole.CLIENT,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    };

    const generateHistoryList = (numbers: number) => {
        const historyList: History[] = [];

        for (let index = 1; index <= numbers; index++) {
            const history = new History();
            history.price = "Navigo";
            history.user = user;
            history.departureStation = "Gare Montparnasse";

            historyList.push(history);
        }

        return historyList;
    };
});
