import { Module } from '@nestjs/common';
import { ProntuarioUseCase } from '../../application/use-cases/prontuario.use-case';
import { ProntuarioController } from '../controllers/prontuario.controller';
import { InMemoryAgendamentoRepository } from '../persistence/in-memory-agendamento.repository';
import { InMemoryPacienteRepository } from '../persistence/in-memory-paciente.repository';
import { InMemoryProntuarioRepository } from '../persistence/in-memory-prontuario.repository';
import { InMemoryUserRepository } from '../persistence/in-memory-user.repository';
import {
  AGENDAMENTO_REPOSITORY,
  PACIENTE_REPOSITORY,
  PRONTUARIO_REPOSITORY,
  USER_REPOSITORY,
} from '../tokens/injection.tokens';

@Module({
  controllers: [ProntuarioController],
  providers: [
    ProntuarioUseCase,
    {
      provide: PRONTUARIO_REPOSITORY,
      useClass: InMemoryProntuarioRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: PACIENTE_REPOSITORY,
      useClass: InMemoryPacienteRepository,
    },
    {
      provide: AGENDAMENTO_REPOSITORY,
      useClass: InMemoryAgendamentoRepository,
    },
  ],
  exports: [ProntuarioUseCase],
})
export class ProntuarioModule {}
