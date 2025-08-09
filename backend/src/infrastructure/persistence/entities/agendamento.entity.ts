import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { UserEntity } from './user.entity';

@Entity('agendamentos')
export class AgendamentoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  pacienteId: string;

  @ManyToOne(() => PacienteEntity)
  @JoinColumn({ name: 'pacienteId' })
  paciente: PacienteEntity;

  @Column({ type: 'uuid' })
  medicoId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'medicoId' })
  medico: UserEntity;

  @Column({ type: 'timestamp' })
  dataHora: Date;

  @Column({ type: 'enum', enum: ['CONSULTA', 'EXAME', 'RETORNO'], default: 'CONSULTA' })
  tipo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observacoes?: string;

  @Column({ type: 'enum', enum: ['AGENDADO', 'CONFIRMADO', 'CANCELADO', 'REALIZADO'], default: 'AGENDADO' })
  status: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
