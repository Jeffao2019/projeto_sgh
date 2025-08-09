import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prontuario } from '../../domain/entities/prontuario.entity';
import type { AgendamentoRepository } from '../../domain/repositories/agendamento.repository';
import type { PacienteRepository } from '../../domain/repositories/paciente.repository';
import type { ProntuarioRepository } from '../../domain/repositories/prontuario.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import {
  AGENDAMENTO_REPOSITORY,
  PACIENTE_REPOSITORY,
  PRONTUARIO_REPOSITORY,
  USER_REPOSITORY,
} from '../../infrastructure/tokens/injection.tokens';
import {
  CreateProntuarioDto,
  UpdateProntuarioDto,
} from '../dto/prontuario.dto';

@Injectable()
export class ProntuarioUseCase {
  constructor(
    @Inject(PRONTUARIO_REPOSITORY)
    private readonly prontuarioRepository: ProntuarioRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
    @Inject(AGENDAMENTO_REPOSITORY)
    private readonly agendamentoRepository: AgendamentoRepository,
  ) {}

  async create(createProntuarioDto: CreateProntuarioDto): Promise<Prontuario> {
    // Verificar se paciente existe
    const paciente = await this.pacienteRepository.findById(
      createProntuarioDto.pacienteId,
    );
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Verificar se médico existe
    const medico = await this.userRepository.findById(
      createProntuarioDto.medicoId,
    );
    if (!medico) {
      throw new NotFoundException('Médico não encontrado');
    }

    // Verificar se agendamento existe
    const agendamento = await this.agendamentoRepository.findById(
      createProntuarioDto.agendamentoId,
    );
    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    // Verificar se já existe prontuário para este agendamento
    const existingProntuario =
      await this.prontuarioRepository.findByAgendamentoId(
        createProntuarioDto.agendamentoId,
      );
    if (existingProntuario) {
      throw new BadRequestException(
        'Já existe um prontuário para este agendamento',
      );
    }

    // Verificar se o agendamento pertence ao paciente e médico corretos
    if (agendamento.pacienteId !== createProntuarioDto.pacienteId) {
      throw new BadRequestException(
        'Agendamento não pertence ao paciente informado',
      );
    }

    if (agendamento.medicoId !== createProntuarioDto.medicoId) {
      throw new BadRequestException(
        'Agendamento não pertence ao médico informado',
      );
    }

    // Criar prontuário
    const prontuario = Prontuario.create(
      createProntuarioDto.pacienteId,
      createProntuarioDto.medicoId,
      createProntuarioDto.agendamentoId,
      new Date(createProntuarioDto.dataConsulta),
      createProntuarioDto.anamnese,
      createProntuarioDto.exameFisico,
      createProntuarioDto.diagnostico,
      createProntuarioDto.prescricao,
      createProntuarioDto.observacoes,
    );

    return await this.prontuarioRepository.create(prontuario);
  }

  async findById(id: string): Promise<Prontuario> {
    const prontuario = await this.prontuarioRepository.findById(id);
    if (!prontuario) {
      throw new NotFoundException('Prontuário não encontrado');
    }
    return prontuario;
  }

  async findByPacienteId(pacienteId: string): Promise<Prontuario[]> {
    // Verificar se paciente existe
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return await this.prontuarioRepository.findByPacienteId(pacienteId);
  }

  async findByMedicoId(medicoId: string): Promise<Prontuario[]> {
    // Verificar se médico existe
    const medico = await this.userRepository.findById(medicoId);
    if (!medico) {
      throw new NotFoundException('Médico não encontrado');
    }

    return await this.prontuarioRepository.findByMedicoId(medicoId);
  }

  async findByAgendamentoId(agendamentoId: string): Promise<Prontuario | null> {
    return await this.prontuarioRepository.findByAgendamentoId(agendamentoId);
  }

  async findAll(page = 1, limit = 10): Promise<Prontuario[]> {
    return await this.prontuarioRepository.findAll(page, limit);
  }

  async findAllWithRelations(): Promise<any[]> {
    return await (this.prontuarioRepository as any).findAllWithRelations();
  }

  async findByPacienteIdWithRelations(pacienteId: string): Promise<any[]> {
    // Verificar se paciente existe
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Buscar todos os prontuários com relações e filtrar pelo paciente
    const allProntuarios = await (this.prontuarioRepository as any).findAllWithRelations();
    return allProntuarios.filter((prontuario: any) => prontuario.pacienteId === pacienteId);
  }

  async update(
    id: string,
    updateProntuarioDto: UpdateProntuarioDto,
  ): Promise<Prontuario> {
    const prontuario = await this.findById(id);

    // Atualizar prontuário
    const updatedProntuario = prontuario.update(
      updateProntuarioDto.anamnese || prontuario.anamnese,
      updateProntuarioDto.exameFisico || prontuario.exameFisico,
      updateProntuarioDto.diagnostico || prontuario.diagnostico,
      updateProntuarioDto.prescricao || prontuario.prescricao,
      updateProntuarioDto.observacoes !== undefined
        ? updateProntuarioDto.observacoes
        : prontuario.observacoes,
    );

    return await this.prontuarioRepository.update(updatedProntuario);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verificar se existe
    await this.prontuarioRepository.delete(id);
  }
}
