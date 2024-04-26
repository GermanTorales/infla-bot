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
    entities: ["dist/domain/entities/**/*.entity.js"],
    migrationsTableName: "migration",
    migrations: ["dist/domain/entites/migration/**/*.js"],
    cli: {
      migrationsDir: "migration",
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
