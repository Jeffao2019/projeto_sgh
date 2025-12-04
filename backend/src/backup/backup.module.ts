import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module';
import { BackupConfigEntity } from '../infrastructure/persistence/entities/backup-config.entity';

@Module({
  imports: [
    PersistenceModule,
    TypeOrmModule.forFeature([BackupConfigEntity])
  ],
  providers: [BackupService],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
