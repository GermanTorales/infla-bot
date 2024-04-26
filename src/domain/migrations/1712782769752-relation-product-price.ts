import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class RelationProductPrice1712782769752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      "history_prices",
      new TableForeignKey({
        columnNames: ["product"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("history_prices");
    const productForeignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("product") !== -1);

    await queryRunner.dropForeignKey("history_prices", productForeignKey);
  }
}
