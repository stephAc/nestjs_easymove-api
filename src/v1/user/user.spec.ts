import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { AppModule } from "../app.module";
import { UserController } from "./user.controller";
import User from "./user.entity";
import { UserService } from "./user.service";

describe("User", () => {
    let moduleRef: TestingModule;
    let controller: UserController;
    let service: UserService;
    let repository: Repository<User>;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        service = moduleRef.get<UserService>(UserService);
        controller = moduleRef.get<UserController>(UserController);
        repository = moduleRef.get("UserRepository");

        await repository.query("DELETE from users;");
    });

    describe("index", () => {
        it("should return an array of users", async () => {
            await repository.save(users);

            const response = await controller.index();

            expect(response).toEqual(users);
            expect(response.length).toEqual(2);
        });

        it("should return an empty array", async () => {
            const response = await controller.index();
            expect(response).toEqual(expect.any(Array));
            expect(response.length).toEqual(0);
        });

        afterEach(async () => {
            await repository.query(`DELETE FROM users;`);
        });
    });

    afterAll(async () => {
        await moduleRef.close();
    });
});

const users: Omit<User, "createdAt" | "updatedAt" | "historyList">[] = [
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
