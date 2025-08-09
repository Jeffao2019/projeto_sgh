import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AgendamentoModule } from './infrastructure/modules/agendamento.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { PacienteModule } from './infrastructure/modules/paciente.module';
import { ProntuarioModule } from './infrastructure/modules/prontuario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PersistenceModule,
    AuthModule,
    PacienteModule,
    AgendamentoModule,
    ProntuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
