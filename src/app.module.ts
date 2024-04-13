import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { NormalizeResponseInterceptor } from "./infrastructure/utils";
import { InflationModule, ProductModule } from "src/infrastructure/modules";
import { PuppeteerModule, TypeOrmConfigModule } from "src/infrastructure/dependencies";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    TypeOrmConfigModule,
    PuppeteerModule,
    InflationModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: NormalizeResponseInterceptor,
    },
  ],
})
export class AppModule {}
