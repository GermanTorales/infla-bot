import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateTableProducts1712789473977 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "products",
      new TableColumn({
        name: "name",
        type: "varchar",
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("products", "name");
  }
}
