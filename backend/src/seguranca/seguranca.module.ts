import { Module } from '@nestjs/common';
import { SegurancaService } from './seguranca.service';
import { SegurancaController } from './seguranca.controller';

@Module({
  providers: [SegurancaService],
  controllers: [SegurancaController],
  exports: [SegurancaService],
})
export class SegurancaModule {}
