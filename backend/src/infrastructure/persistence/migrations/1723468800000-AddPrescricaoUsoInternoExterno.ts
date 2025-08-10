import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPrescricaoUsoInternoExterno1723468800000 implements MigrationInterface {
    name = 'AddPrescricaoUsoInternoExterno1723468800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("prontuarios", new TableColumn({
            name: "prescricaoUsoInterno",
            type: "text",
            isNullable: true,
        }));

        await queryRunner.addColumn("prontuarios", new TableColumn({
            name: "prescricaoUsoExterno", 
            type: "text",
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("prontuarios", "prescricaoUsoExterno");
        await queryRunner.dropColumn("prontuarios", "prescricaoUsoInterno");
    }
}
