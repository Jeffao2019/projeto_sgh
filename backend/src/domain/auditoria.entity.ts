import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  userRole: string;

  @Column()
  action: string;

  @Column()
  resource: string;

  @Column('json', { nullable: true })
  details: any;

  @Column()
  ip: string;

  @Column()
  userAgent: string;

  @Column()
  success: boolean;

  @CreateDateColumn()
  timestamp: Date;
}
