import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Repository } from "typeorm";
import * as supertest from "supertest";

import { User } from "../src/v1/user/user.entity";
// import { User } from "src/v1/user/interface/user.test.interface";
import { AppModule } from "../src/v1/app.module";

let token: string = "";

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
        await repository.save(JSON.parse(JSON.stringify(users)));

        let body = await supertest
            .agent(app.getHttpServer())
            .post("/auth/register")
            .send({
                username: "test",
                email: "test@test.com",
                password: "root",
            });

        body = await supertest
            .agent(app.getHttpServer())
            .post("/auth/login")
            .send({
                email: "test@test.com",
                password: "root",
            });

        token = (body as any).body.token;
    });

    it("/ (GET)", async () => {
        const { body } = await supertest
            .agent(app.getHttpServer())
            .get("/users")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(body.length).toEqual(3);
    });

    it("/:id (GET)", async () => {
        const { body } = await supertest
            .agent(app.getHttpServer())
            .get("/users/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200);

        expect(body).toEqual(
            expect.objectContaining({
                id: users[0].id,
                email: users[0].email,
                username: users[0].username,
                password: users[0].password,
                role: users[0].role,
            }),
        );
    });

    it("/:id (GET) should return 404", () => {
        return request(app.getHttpServer())
            .get("/users/0")
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });

    afterAll(async () => {
        await repository.query(`DELETE FROM users;`);
        await app.close();
    });
});

const users: Omit<User, "createdAt" | "updatedAt">[] = [
    {
        id: "1",
        email: "aa@aa.com",
        username: "test",
        password: "password",
        role: 10,
    },
    {
        id: "2",
        email: "bb@bb.com",
        username: "test2",
        password: "password",
        role: 10,
    },
];
