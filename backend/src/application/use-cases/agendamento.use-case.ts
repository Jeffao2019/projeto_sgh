import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Agendamento } from '../../domain/entities/agendamento.entity';
import type { AgendamentoRepository } from '../../domain/repositories/agendamento.repository';
import type { PacienteRepository } from '../../domain/repositories/paciente.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import {
  AGENDAMENTO_REPOSITORY,
  PACIENTE_REPOSITORY,
  USER_REPOSITORY,
} from '../../infrastructure/tokens/injection.tokens';
import {
  CreateAgendamentoDto,
  UpdateAgendamentoDto,
} from '../dto/agendamento.dto';

@Injectable()
export class AgendamentoUseCase {
  constructor(
    @Inject(AGENDAMENTO_REPOSITORY)
    private readonly agendamentoRepository: AgendamentoRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
  ) {}

  async create(
    createAgendamentoDto: CreateAgendamentoDto,
  ): Promise<Agendamento> {
    // Verificar se paciente existe
    const paciente = await this.pacienteRepository.findById(
      createAgendamentoDto.pacienteId,
    );
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }

    // Verificar se médico existe
    const medico = await this.userRepository.findById(
      createAgendamentoDto.medicoId,
    );
    if (!medico) {
      throw new NotFoundException('Médico não encontrado');
    }

    // Verificar se a data não é no passado
    const dataHora = new Date(createAgendamentoDto.dataHora);
    if (dataHora < new Date()) {
      throw new BadRequestException(
        'Não é possível agendar para uma data passada',
      );
    }

    // Verificar disponibilidade do médico
    const isAvailable = await this.agendamentoRepository.checkAvailability(
      createAgendamentoDto.medicoId,
      dataHora,
    );

    if (!isAvailable) {
      throw new ConflictException('Médico não está disponível neste horário');
    }

    // Criar agendamento
    const agendamento = Agendamento.create(
      createAgendamentoDto.pacienteId,
      createAgendamentoDto.medicoId,
      dataHora,
      createAgendamentoDto.tipo,
      createAgendamentoDto.observacoes,
    );

    return await this.agendamentoRepository.create(agendamento);
  }

  async findById(id: string): Promise<Agendamento> {
    const agendamento = await this.agendamentoRepository.findById(id);
    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return agendamento;
  }

  async findByPacienteId(pacienteId: string): Promise<Agendamento[]> {
    return await this.agendamentoRepository.findByPacienteId(pacienteId);
  }

  async findByMedicoId(medicoId: string): Promise<Agendamento[]> {
    return await this.agendamentoRepository.findByMedicoId(medicoId);
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Agendamento[]> {
    return await this.agendamentoRepository.findByDateRange(startDate, endDate);
  }

  async findAll(page = 1, limit = 50): Promise<Agendamento[]> {
    return await this.agendamentoRepository.findAll(page, limit);
  }

  async update(
    id: string,
    updateAgendamentoDto: UpdateAgendamentoDto,
  ): Promise<Agendamento> {
    const agendamento = await this.findById(id);

    // Verificar se está realmente reagendando (mudança efetiva de data/hora)
    let dataRealmenteMudou = false;
    if (updateAgendamentoDto.dataHora) {
      const novaDataHora = new Date(updateAgendamentoDto.dataHora);
      const dataAtual = new Date(agendamento.dataHora);

      // Verificar se a data realmente mudou (comparar timestamps)
      dataRealmenteMudou = novaDataHora.getTime() !== dataAtual.getTime();

      if (dataRealmenteMudou) {
        // Verificar se a nova data não é no passado
        if (novaDataHora < new Date()) {
          throw new BadRequestException(
            'Não é possível reagendar para uma data passada',
          );
        }

        // Verificar disponibilidade do médico na nova data
        const isAvailable = await this.agendamentoRepository.checkAvailability(
          agendamento.medicoId,
          novaDataHora,
        );

        if (!isAvailable) {
          throw new ConflictException('Médico não está disponível neste horário');
        }

        // Se está reagendando E não há status específico sendo definido, usar REAGENDADO
        if (!updateAgendamentoDto.status) {
          const reagendamento = agendamento.reagendar(novaDataHora);
          return await this.agendamentoRepository.update(reagendamento);
        }
      }
    }

    // Para atualizações que não são reagendamento ou quando há status específico
    const agendamentoAtualizado = agendamento.atualizar(
      dataRealmenteMudou && updateAgendamentoDto.dataHora ? new Date(updateAgendamentoDto.dataHora) : undefined,
      updateAgendamentoDto.tipo,
      updateAgendamentoDto.status,
      updateAgendamentoDto.observacoes,
    );

    return await this.agendamentoRepository.update(agendamentoAtualizado);
  }

  async confirmar(id: string): Promise<Agendamento> {
    const agendamento = await this.findById(id);
    const agendamentoConfirmado = agendamento.confirmar();
    return await this.agendamentoRepository.update(agendamentoConfirmado);
  }

  async cancelar(id: string): Promise<Agendamento> {
    const agendamento = await this.findById(id);
    const agendamentoCancelado = agendamento.cancelar();
    return await this.agendamentoRepository.update(agendamentoCancelado);
  }

  async finalizar(id: string): Promise<Agendamento> {
    const agendamento = await this.findById(id);
    const agendamentoFinalizado = agendamento.finalizar();
    return await this.agendamentoRepository.update(agendamentoFinalizado);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Verificar se existe
    await this.agendamentoRepository.delete(id);
  }

  async findAgendamentosParaProntuario(): Promise<Agendamento[]> {
    // Buscar agendamentos confirmados que ainda não têm prontuário
    const agendamentos = await this.agendamentoRepository.findAll();
    return agendamentos.filter(agendamento => 
      agendamento.status === 'CONFIRMADO' || agendamento.status === 'FINALIZADO'
    );
  }
}
