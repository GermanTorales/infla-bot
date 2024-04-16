import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class TableProducts1712759542731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isUnique: true,
            generationStrategy: "uuid",
          },
          {
            name: "coto_url",
            type: "varchar",
            isNullable: true,
            default: null,
          },
          {
            name: "carrefour_url",
            type: "varchar",
            isNullable: true,
            default: null,
          },
          {
            name: "dia_url",
            type: "varchar",
            isNullable: true,
            default: null,
          },
          {
            name: "status",
            type: "enum",
            enum: ["active", "inactive", "deleted"],
            default: "'active'",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
