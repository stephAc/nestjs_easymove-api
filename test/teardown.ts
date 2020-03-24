import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/v1/app.module";

module.exports = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    const repository = app.get("UserRepository");

    await app.init();
    await repository.query(`DELETE FROM users;`);

    process.env.TOKEN = undefined;

    await app.close();
};
