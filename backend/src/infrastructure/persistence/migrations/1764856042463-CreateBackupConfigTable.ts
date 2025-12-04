import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBackupConfigTable1764856042463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "backup_config" (
                "id" SERIAL NOT NULL,
                "automatico" boolean NOT NULL DEFAULT true,
                "frequencia" character varying(50) NOT NULL DEFAULT 'diario',
                "horario" time NOT NULL DEFAULT '02:00',
                "retencao" integer NOT NULL DEFAULT 30,
                "local" character varying(100) NOT NULL DEFAULT 'local',
                "compressao" boolean NOT NULL DEFAULT true,
                "criptografia" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_backup_config_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "backup_config"`);
    }

}
