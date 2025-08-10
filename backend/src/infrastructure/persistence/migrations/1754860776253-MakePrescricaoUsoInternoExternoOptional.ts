import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePrescricaoUsoInternoExternoOptional1754860776253 implements MigrationInterface {
    name = 'MakePrescricaoUsoInternoExternoOptional1754860776253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Tornar os campos prescricaoUsoInterno e prescricaoUsoExterno opcionais (nullable)
        await queryRunner.query(`ALTER TABLE "prontuarios" ALTER COLUMN "prescricaoUsoInterno" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prontuarios" ALTER COLUMN "prescricaoUsoExterno" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter: tornar os campos obrigatórios novamente
        // Atenção: Isso pode falhar se houver registros com valores NULL
        await queryRunner.query(`ALTER TABLE "prontuarios" ALTER COLUMN "prescricaoUsoInterno" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "prontuarios" ALTER COLUMN "prescricaoUsoExterno" SET NOT NULL`);
    }

}
