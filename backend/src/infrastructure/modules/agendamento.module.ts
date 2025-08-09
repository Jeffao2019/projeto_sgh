import { Module } from '@nestjs/common';
import { AgendamentoUseCase } from '../../application/use-cases/agendamento.use-case';
import { ValidacaoService } from '../../domain/services/validacao.service';
import { AgendamentoController } from '../controllers/agendamento.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import {
  AGENDAMENTO_REPOSITORY,
  PACIENTE_REPOSITORY,
  USER_REPOSITORY,
  VALIDACAO_SERVICE,
} from '../tokens/injection.tokens';

@Module({
  imports: [PersistenceModule],
  controllers: [AgendamentoController],
  providers: [
    AgendamentoUseCase,
    {
      provide: VALIDACAO_SERVICE,
      useClass: ValidacaoService,
    },
  ],
  exports: [AgendamentoUseCase],
})
export class AgendamentoModule {}
