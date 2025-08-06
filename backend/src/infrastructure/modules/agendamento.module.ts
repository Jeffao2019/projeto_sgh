import { Module } from '@nestjs/common';
import { AgendamentoUseCase } from '../../application/use-cases/agendamento.use-case';
import { AgendamentoController } from '../controllers/agendamento.controller';
import { InMemoryAgendamentoRepository } from '../persistence/in-memory-agendamento.repository';
import { InMemoryPacienteRepository } from '../persistence/in-memory-paciente.repository';
import { InMemoryUserRepository } from '../persistence/in-memory-user.repository';
import {
  AGENDAMENTO_REPOSITORY,
  PACIENTE_REPOSITORY,
  USER_REPOSITORY,
} from '../tokens/injection.tokens';

@Module({
  controllers: [AgendamentoController],
  providers: [
    AgendamentoUseCase,
    {
      provide: AGENDAMENTO_REPOSITORY,
      useClass: InMemoryAgendamentoRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: PACIENTE_REPOSITORY,
      useClass: InMemoryPacienteRepository,
    },
  ],
  exports: [AgendamentoUseCase],
})
export class AgendamentoModule {}
