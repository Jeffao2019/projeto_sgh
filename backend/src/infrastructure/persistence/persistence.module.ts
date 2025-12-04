import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import { DatabaseModule } from './database.module';

// Entities
import {
  PacienteEntity,
  UserEntity,
  AgendamentoEntity,
  ProntuarioEntity,
  BackupConfigEntity,
} from './entities';

// Repositories
import {
  TypeOrmPacienteRepository,
  TypeOrmUserRepository,
  TypeOrmAgendamentoRepository,
  TypeOrmProntuarioRepository,
} from './repositories';

// Repository tokens
import {
  PACIENTE_REPOSITORY,
  USER_REPOSITORY,
  AGENDAMENTO_REPOSITORY,
  PRONTUARIO_REPOSITORY,
} from './../tokens/injection.tokens';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    DatabaseModule,
    TypeOrmModule.forFeature([
      PacienteEntity,
      UserEntity,
      AgendamentoEntity,
      ProntuarioEntity,
      BackupConfigEntity,
    ]),
  ],
  providers: [
    {
      provide: PACIENTE_REPOSITORY,
      useClass: TypeOrmPacienteRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: AGENDAMENTO_REPOSITORY,
      useClass: TypeOrmAgendamentoRepository,
    },
    {
      provide: PRONTUARIO_REPOSITORY,
      useClass: TypeOrmProntuarioRepository,
    },
  ],
  exports: [
    PACIENTE_REPOSITORY,
    USER_REPOSITORY,
    AGENDAMENTO_REPOSITORY,
    PRONTUARIO_REPOSITORY,
  ],
})
export class PersistenceModule {}
