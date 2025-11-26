import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEnum, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export enum TipoUnidade {
  HOSPITAL = 'HOSPITAL',
  CLINICA = 'CLINICA',
  UPA = 'UPA',
  PSF = 'PSF',
  AMBULATORIO = 'AMBULATORIO',
  LABORATORIO = 'LABORATORIO',
  FILIAL = 'FILIAL'
}

export enum StatusUnidade {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  MANUTENCAO = 'MANUTENCAO',
  TEMPORARIA = 'TEMPORARIA'
}

@Entity('unidades_hospitalares')
export class UnidadeHospitalar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  nome: string;

  @Column({ length: 100, unique: true })
  codigo: string;

  @Column({
    type: 'enum',
    enum: TipoUnidade,
    default: TipoUnidade.CLINICA
  })
  @IsEnum(TipoUnidade)
  tipo: TipoUnidade;

  @Column({
    type: 'enum',
    enum: StatusUnidade,
    default: StatusUnidade.ATIVA
  })
  @IsEnum(StatusUnidade)
  status: StatusUnidade;

  @Column({ length: 14, nullable: true })
  cnpj: string;

  @Column({ length: 100, nullable: true })
  @IsEmail()
  email: string;

  @Column({ length: 15, nullable: true })
  @IsPhoneNumber('BR')
  telefone: string;

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @Column({ length: 100, nullable: true })
  cidade: string;

  @Column({ length: 2, nullable: true })
  estado: string;

  @Column({ length: 8, nullable: true })
  cep: string;

  @Column({ type: 'int', default: 100 })
  capacidadeLeitos: number;

  @Column({ type: 'int', default: 10 })
  capacidadeUTI: number;

  @Column({ type: 'simple-json', nullable: true })
  configuracoes: any;

  @Column({ type: 'simple-json', nullable: true })
  responsaveis: any;

  @Column({ default: true })
  isMatriz: boolean;

  @Column({ type: 'uuid', nullable: true })
  unidadePaiId: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}