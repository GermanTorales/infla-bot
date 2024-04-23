import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { EventEmitterModule } from "@nestjs/event-emitter";

import * as Cronjobs from "./infrastructure/cron";
import * as Modules from "src/infrastructure/modules";
import { TypeOrmConfigModule } from "src/infrastructure/dependencies";
import { NormalizeResponseInterceptor } from "./infrastructure/utils";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmConfigModule,
    Modules.InflationModule,
    Modules.ProductModule,
    Modules.ChartModule,
  ],
  controllers: [],
  providers: [
    Cronjobs.ScrapPricesCronV1,
    {
      provide: APP_INTERCEPTOR,
      useClass: NormalizeResponseInterceptor,
    },
  ],
})
export class AppModule {}
