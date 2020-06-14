import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./v1/app.module";

const WHITE_LIST = ["http://localhost:3000", "https://94.238.22.29"];

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

    app.enableCors({
        credentials: true,
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (WHITE_LIST.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    });
    app.setGlobalPrefix(version);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
