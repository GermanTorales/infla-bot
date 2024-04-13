import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private configService: ConfigService) {}

  getDatabaseHost(): string {
    return this.configService.get<string>('MYSQL_HOST');
  }

  getDatabasePort(): number {
    return this.configService.get<number>('MYSQL_PORT');
  }

  getDatabaseUser(): string {
    return this.configService.get<string>('MYSQL_USER');
  }

  getDatabasePassword(): string {
    return this.configService.get<string>('MYSQL_PASSWORD');
  }

  getDatabaseName(): string {
    return this.configService.get<string>('MYSQL_DATABASE');
  }

  getDatabaseSchema(): string {
    return this.configService.get<string>('DATABASE_SCHEMA');
  }

  getDatabaseSync(): boolean {
    return false;
  }
}
