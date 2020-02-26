import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import User from "src/v1/user/user.entity";
import * as request from "supertest";
import { Repository } from "typeorm";
import { AppModule } from "../src/v1/app.module";

describe("UserController (e2e)", () => {
    let app: INestApplication;
    let repository: Repository<User>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        repository = app.get("UserRepository");

        await app.init();
        await repository.save(users);
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer())
            .get("/users")
            .expect(200)
            .expect(users);
    });

    it("/:id (GET)", () => {
        return request(app.getHttpServer())
            .get("/users/1")
            .expect(200)
            .expect(users[0]);
    });

    it("/:id (GET) should return 404", () => {
        return request(app.getHttpServer())
            .get("/users/0")
            .expect(404);
    });

    afterAll(async () => {
        await repository.query(`DELETE FROM users;`);
        await app.close();
    });
});

const users: User[] = [
    {
        id: 1,
        email: "aa@aa.com",
        password: "password",
    },
    {
        id: 2,
        email: "bb@bb.com",
        password: "password",
    },
];
