import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./v1/app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const version = "/api/v1";

    const options = new DocumentBuilder()
        .setTitle("EasyMove Documentation")
        .setDescription("Documentation de l'API EasyMove v1")
        .setVersion("1.0.0")
        .addServer(version)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${version}/documentation`, app, document);

    app.setGlobalPrefix(version);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
