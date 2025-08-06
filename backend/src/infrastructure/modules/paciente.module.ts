import { Module } from '@nestjs/common';
import { PacienteUseCase } from '../../application/use-cases/paciente.use-case';
import { ValidacaoService } from '../../domain/services/validacao.service';
import { PacienteController } from '../controllers/paciente.controller';
import { InMemoryPacienteRepository } from '../persistence/in-memory-paciente.repository';
import {
  PACIENTE_REPOSITORY,
  VALIDACAO_SERVICE,
} from '../tokens/injection.tokens';

@Module({
  controllers: [PacienteController],
  providers: [
    PacienteUseCase,
    {
      provide: PACIENTE_REPOSITORY,
      useClass: InMemoryPacienteRepository,
    },
    {
      provide: VALIDACAO_SERVICE,
      useClass: ValidacaoService,
    },
  ],
  exports: [PacienteUseCase],
})
export class PacienteModule {}
