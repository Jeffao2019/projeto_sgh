import { Module } from '@nestjs/common';
import { ProntuarioUseCase } from '../../application/use-cases/prontuario.use-case';
import { ProntuarioController } from '../controllers/prontuario.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import {
  AGENDAMENTO_REPOSITORY,
  PACIENTE_REPOSITORY,
  PRONTUARIO_REPOSITORY,
  USER_REPOSITORY,
} from '../tokens/injection.tokens';

@Module({
  imports: [PersistenceModule],
  controllers: [ProntuarioController],
  providers: [
    ProntuarioUseCase,
  ],
  exports: [ProntuarioUseCase],
})
export class ProntuarioModule {}
