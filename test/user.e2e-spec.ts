import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { Repository } from "typeorm";
import { AppModule } from "../src/v1/app.module";
import User from "../src/v1/user/user.entity";

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

    it("/ (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get("/users")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(200);

        expect(body.length).toEqual(3);
    });

    it("/:id (GET)", async () => {
        const { body } = await request(app.getHttpServer())
            .get("/users/2")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(200);

        const { id, email, username, password, role } = users[0];

        expect(body).toEqual(
            expect.objectContaining({
                id,
                email,
                username,
                password,
                role,
            }),
        );
    });

    it("/:id (GET) should return 404", () => {
        return request(app.getHttpServer())
            .get("/users/0")
            .set("Authorization", `Bearer ${process.env.TOKEN}`)
            .expect(404);
    });

    afterAll(async () => {
        await repository.query(`DELETE FROM users WHERE username <> 'auth';`);
        await app.close();
    });
});

const users: Omit<User, "createdAt" | "updatedAt">[] = [
    {
        id: "2",
        email: "aa@aa.com",
        username: "test",
        password: "password",
        role: 10,
    },
    {
        id: "3",
        email: "bb@bb.com",
        username: "test2",
        password: "password",
        role: 10,
    },
];
