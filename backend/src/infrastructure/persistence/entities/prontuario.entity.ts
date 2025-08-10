import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PacienteEntity } from './paciente.entity';
import { UserEntity } from './user.entity';
import { AgendamentoEntity } from './agendamento.entity';

@Entity('prontuarios')
export class ProntuarioEntity {
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

  @Column({ type: 'uuid', nullable: true })
  agendamentoId?: string;

  @ManyToOne(() => AgendamentoEntity)
  @JoinColumn({ name: 'agendamentoId' })
  agendamento?: AgendamentoEntity;

  @Column({ type: 'text' })
  queixaPrincipal: string;

  @Column({ type: 'text' })
  historiaDoencaAtual: string;

  @Column({ type: 'text', nullable: true })
  historicoMedico?: string;

  @Column({ type: 'text', nullable: true })
  exameFisico?: string;

  @Column({ type: 'text', nullable: true })
  diagnostico?: string;

  @Column({ type: 'text', nullable: true })
  prescricao?: string; // Opcional - apenas para uso interno do hospital

  @Column({ type: 'text' })
  prescricaoUsoInterno: string; // Obrigatório - para ambiente domiciliar

  @Column({ type: 'text' })
  prescricaoUsoExterno: string; // Obrigatório - para ambiente externo

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dataConsulta: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
