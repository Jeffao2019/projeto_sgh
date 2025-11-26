import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AgendamentoModule } from './infrastructure/modules/agendamento.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { PacienteModule } from './infrastructure/modules/paciente.module';
import { ProntuarioModule } from './infrastructure/modules/prontuario.module';
import { BackupModule } from './backup/backup.module';
import { SegurancaModule } from './seguranca/seguranca.module';

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
    BackupModule,
    SegurancaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
