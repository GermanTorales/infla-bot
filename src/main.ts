import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger, ValidationPipe, VersioningType } from "@nestjs/common";

import { AppModule } from "./app.module";
import { morganError, morganSuccess } from "src/infrastructure/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const NODE_PORT = configService.get("NODE_PORT");

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
      },
    }),
  );

  app.setGlobalPrefix("api");
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });
  app.use(morganSuccess);
  app.use(morganError);

  await app.listen(NODE_PORT, () => {
    Logger.log(`Api listening on port: [${NODE_PORT}]`);
  });
}
bootstrap();
