import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [BackupService],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
