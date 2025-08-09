import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateInitialTables1640995200000 implements MigrationInterface {
  name = 'CreateInitialTables1640995200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'senha',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'papel',
            type: 'enum',
            enum: ['ADMIN', 'MEDICO', 'RECEPCIONISTA'],
            default: "'RECEPCIONISTA'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create Pacientes table
    await queryRunner.createTable(
      new Table({
        name: 'pacientes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '11',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
          },
          {
            name: 'telefone',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'dataNascimento',
            type: 'date',
          },
          {
            name: 'endereco',
            type: 'jsonb',
          },
          {
            name: 'convenio',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'numeroConvenio',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create Agendamentos table
    await queryRunner.createTable(
      new Table({
        name: 'agendamentos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'pacienteId',
            type: 'uuid',
          },
          {
            name: 'medicoId',
            type: 'uuid',
          },
          {
            name: 'dataHora',
            type: 'timestamp',
          },
          {
            name: 'tipo',
            type: 'enum',
            enum: ['CONSULTA', 'EXAME', 'RETORNO'],
            default: "'CONSULTA'",
          },
          {
            name: 'observacoes',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['AGENDADO', 'CONFIRMADO', 'CANCELADO', 'REALIZADO'],
            default: "'AGENDADO'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['pacienteId'],
            referencedTableName: 'pacientes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['medicoId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create Prontuarios table
    await queryRunner.createTable(
      new Table({
        name: 'prontuarios',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'pacienteId',
            type: 'uuid',
          },
          {
            name: 'medicoId',
            type: 'uuid',
          },
          {
            name: 'agendamentoId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'queixaPrincipal',
            type: 'text',
          },
          {
            name: 'historiaDoencaAtual',
            type: 'text',
          },
          {
            name: 'historicoMedico',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'exameFisico',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'diagnostico',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'prescricao',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'observacoes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'dataConsulta',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['pacienteId'],
            referencedTableName: 'pacientes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['medicoId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('prontuarios');
    await queryRunner.dropTable('agendamentos');
    await queryRunner.dropTable('pacientes');
    await queryRunner.dropTable('users');
  }
}
