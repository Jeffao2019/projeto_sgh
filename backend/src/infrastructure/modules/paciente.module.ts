import { Module } from '@nestjs/common';
import { PacienteUseCase } from '../../application/use-cases/paciente.use-case';
import { ValidacaoService } from '../../domain/services/validacao.service';
import { PacienteController } from '../controllers/paciente.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import {
  PACIENTE_REPOSITORY,
  VALIDACAO_SERVICE,
} from '../tokens/injection.tokens';

@Module({
  imports: [PersistenceModule],
  controllers: [PacienteController],
  providers: [
    PacienteUseCase,
    {
      provide: VALIDACAO_SERVICE,
      useClass: ValidacaoService,
    },
  ],
  exports: [PacienteUseCase],
})
export class PacienteModule {}
