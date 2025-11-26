import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndices1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Índices para Pacientes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_paciente_cpf ON pacientes(cpf);
      CREATE INDEX IF NOT EXISTS idx_paciente_email ON pacientes(email);
      CREATE INDEX IF NOT EXISTS idx_paciente_nome ON pacientes(nome);
      CREATE INDEX IF NOT EXISTS idx_paciente_data_nascimento ON pacientes(data_nascimento);
    `);

    // Índices para Agendamentos
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_agendamento_data ON agendamentos(data_agendamento);
      CREATE INDEX IF NOT EXISTS idx_agendamento_paciente ON agendamentos(paciente_id);
      CREATE INDEX IF NOT EXISTS idx_agendamento_medico ON agendamentos(medico_id);
      CREATE INDEX IF NOT EXISTS idx_agendamento_status ON agendamentos(status);
    `);

    // Índices para Prontuários
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_prontuario_paciente ON prontuarios(paciente_id);
      CREATE INDEX IF NOT EXISTS idx_prontuario_data ON prontuarios(data_criacao);
      CREATE INDEX IF NOT EXISTS idx_prontuario_medico ON prontuarios(medico_id);
    `);

    // Índices para Usuários
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(email);
      CREATE INDEX IF NOT EXISTS idx_usuario_tipo ON usuarios(tipo);
      CREATE INDEX IF NOT EXISTS idx_usuario_ativo ON usuarios(ativo);
    `);

    // Índices compostos para consultas frequentes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_agendamento_data_status ON agendamentos(data_agendamento, status);
      CREATE INDEX IF NOT EXISTS idx_prontuario_paciente_data ON prontuarios(paciente_id, data_criacao);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_paciente_cpf;
      DROP INDEX IF EXISTS idx_paciente_email;
      DROP INDEX IF EXISTS idx_paciente_nome;
      DROP INDEX IF EXISTS idx_paciente_data_nascimento;
      DROP INDEX IF EXISTS idx_agendamento_data;
      DROP INDEX IF EXISTS idx_agendamento_paciente;
      DROP INDEX IF EXISTS idx_agendamento_medico;
      DROP INDEX IF EXISTS idx_agendamento_status;
      DROP INDEX IF EXISTS idx_prontuario_paciente;
      DROP INDEX IF EXISTS idx_prontuario_data;
      DROP INDEX IF EXISTS idx_prontuario_medico;
      DROP INDEX IF EXISTS idx_usuario_email;
      DROP INDEX IF EXISTS idx_usuario_tipo;
      DROP INDEX IF EXISTS idx_usuario_ativo;
      DROP INDEX IF EXISTS idx_agendamento_data_status;
      DROP INDEX IF EXISTS idx_prontuario_paciente_data;
    `);
  }
}