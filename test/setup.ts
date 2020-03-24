import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/v1/app.module";

module.exports = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    const repository = app.get("UserRepository");

    await app.init();
    await repository.query(`DELETE FROM users;`);
    await request(app.getHttpServer())
        .post("/auth/register")
        .send({
            username: "auth",
            email: "auth@auth.com",
            password: "password",
        });

    let response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
            email: "auth@auth.com",
            password: "password",
        });

    process.env.TOKEN = response.body.token;

    await app.close();
};
