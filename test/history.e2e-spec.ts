import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Repository } from "typeorm";
import { AppModule } from "../src/v1/app.module";
import History from "../src/v1/history/history.entity";

describe("HistoryController (e2e)", () => {
    let app: INestApplication;
    let repository: Repository<History>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        repository = app.get("HistoryRepository");

        await app.init();
    });

    it("return a 400 when the filter is not matching the enum (DAILY, MONTHLY, ANNUAL) / (GET)", () => {
        return request(app.getHttpServer())
            .get("/history/undefined/1")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("return a 400 when the page is not a number / (GET)", () => {
        return request(app.getHttpServer())
            .get("/history/daily/undefined")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("return a 400 when the page is inferior to 1 / (GET)", () => {
        return request(app.getHttpServer())
            .get("/history/daily/0")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.BAD_REQUEST);
    });

    it("return a 200 with valid arguments / (GET)", () => {
        request(app.getHttpServer())
            .get("/history/daily/1")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.OK);

        request(app.getHttpServer())
            .get("/history/monthly/1")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.OK);

        return request(app.getHttpServer())
            .get("/history/annual/1")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.OK);
    });

    it("show history list of current user, with number of pages", async () => {
        // create 22 items, accept multiple
        await request(app.getHttpServer())
            .post("/history")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .send(generateHistoryList(22))
            .expect(HttpStatus.CREATED);

        // index for user with number of items, pages and 20 items max
        const pageOneResult = await request(app.getHttpServer())
            .get("/history/daily/1")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.OK);

        const pageTwoResult = await request(app.getHttpServer())
            .get("/history/daily/2")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(HttpStatus.OK);

        expect(pageOneResult.body.pageHistoryItems.length).toEqual(20);
        expect(pageOneResult.body.totalHistoryItems).toEqual(22);
        expect(pageOneResult.body.totalPages).toEqual(2);
        expect(pageOneResult.body.page).toEqual(1);

        expect(pageTwoResult.body.pageHistoryItems.length).toEqual(2);
        expect(pageTwoResult.body.totalHistoryItems).toEqual(22);
        expect(pageTwoResult.body.totalPages).toEqual(2);
        expect(pageTwoResult.body.page).toEqual(2);
    });

    afterAll(async () => {
        await repository.query(`DELETE FROM history;`);
        await app.close();
    });

    const generateHistoryList = (
        amount: number,
    ): Omit<History, "id" | "createdAt">[] => {
        let historyList: Omit<History, "id" | "createdAt">[] = [];

        for (let i = 1; i <= amount; i++) {
            const history = new History();
            history.departureStation = "Gare Montparnasse";
            history.price = "Navigo";
            historyList.push(history);
        }

        return historyList;
    };
});
