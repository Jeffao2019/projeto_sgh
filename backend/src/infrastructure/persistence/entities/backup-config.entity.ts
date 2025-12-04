import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('backup_config')
export class BackupConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  automatico: boolean;

  @Column({ type: 'varchar', length: 50, default: 'diario' })
  frequencia: string;

  @Column({ type: 'time', default: '02:00' })
  horario: string;

  @Column({ type: 'int', default: 30 })
  retencao: number;

  @Column({ type: 'varchar', length: 100, default: 'local' })
  local: string;

  @Column({ default: true })
  compressao: boolean;

  @Column({ default: true })
  criptografia: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
