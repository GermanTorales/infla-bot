import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { EnvironmentConfigModule, EnvironmentConfigService } from "src/infrastructure/config";

export const getTypeOrmModuleOptions = (config: EnvironmentConfigService): TypeOrmModuleOptions =>
  ({
    type: "mysql",
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    entities: [__dirname + "./../../../**/*.entity{.ts,.js}"],
    autoLoadEntities: false,
    synchronize: false,
    migrationsRun: false,
    migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
    cli: {
      migrationsDir: "src/migrations",
    },
  }) as TypeOrmModuleOptions;
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
