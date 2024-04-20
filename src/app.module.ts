import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { TypeOrmConfigModule } from "src/infrastructure/dependencies";
import { NormalizeResponseInterceptor } from "./infrastructure/utils";
import * as Modules from "src/infrastructure/modules";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    EventEmitterModule.forRoot(),
    TypeOrmConfigModule,
    Modules.InflationModule,
    Modules.ProductModule,
    Modules.ChartModule,
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
