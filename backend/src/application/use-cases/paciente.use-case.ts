import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Endereco, Paciente } from '../../domain/entities/paciente.entity';
import type { PacienteRepository } from '../../domain/repositories/paciente.repository';
import type { ValidacaoService } from '../../domain/services/validacao.service';
import {
  PACIENTE_REPOSITORY,
  VALIDACAO_SERVICE,
} from '../../infrastructure/tokens/injection.tokens';
import { CreatePacienteDto, UpdatePacienteDto } from '../dto/paciente.dto';

@Injectable()
export class PacienteUseCase {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: PacienteRepository,
    @Inject(VALIDACAO_SERVICE)
    private readonly validacaoService: ValidacaoService,
  ) {}

  async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
    // Validar CPF
    if (!this.validacaoService.validarCPF(createPacienteDto.cpf)) {
      throw new BadRequestException('CPF inválido');
    }

    // Verificar se CPF já existe
    const existingPacienteByCpf = await this.pacienteRepository.findByCpf(
      createPacienteDto.cpf,
    );
    if (existingPacienteByCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    // Verificar se email já existe
    const existingPacienteByEmail = await this.pacienteRepository.findByEmail(
      createPacienteDto.email,
    );
    if (existingPacienteByEmail) {
      throw new ConflictException('Email já cadastrado');
    }

    // Validar email
    if (!this.validacaoService.validarEmail(createPacienteDto.email)) {
      throw new BadRequestException('Email inválido');
    }

    // Validar telefone
    if (!this.validacaoService.validarTelefone(createPacienteDto.telefone)) {
      throw new BadRequestException('Telefone inválido');
    }

    // Validar data de nascimento
    const dataNascimento = new Date(createPacienteDto.dataNascimento);
    if (!this.validacaoService.validarIdade(dataNascimento)) {
      throw new BadRequestException('Data de nascimento inválida');
    }

    // Validar CEP
    if (!this.validacaoService.validarCEP(createPacienteDto.endereco.cep)) {
      throw new BadRequestException('CEP inválido');
    }

    // Criar endereco
    const endereco = new Endereco(
      createPacienteDto.endereco.cep,
      createPacienteDto.endereco.logradouro,
      createPacienteDto.endereco.numero,
      createPacienteDto.endereco.complemento || '',
      createPacienteDto.endereco.bairro,
      createPacienteDto.endereco.cidade,
      createPacienteDto.endereco.estado,
    );

    // Criar paciente
    const paciente = Paciente.create(
      createPacienteDto.nome,
      createPacienteDto.cpf,
      createPacienteDto.email,
      createPacienteDto.telefone,
      dataNascimento,
      endereco,
      createPacienteDto.convenio,
      createPacienteDto.numeroConvenio,
    );

    return await this.pacienteRepository.create(paciente);
  }

  async findById(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado');
    }
    return paciente;
  }

  async findAll(page = 1, limit = 10): Promise<Paciente[]> {
    return await this.pacienteRepository.findAll(page, limit);
  }

  async search(term: string): Promise<Paciente[]> {
    return await this.pacienteRepository.search(term);
  }

  async update(
    id: string,
    updatePacienteDto: UpdatePacienteDto,
  ): Promise<Paciente> {
    const paciente = await this.findById(id);

    // Validar email se fornecido
    if (updatePacienteDto.email) {
      if (!this.validacaoService.validarEmail(updatePacienteDto.email)) {
        throw new BadRequestException('Email inválido');
      }

      // Verificar se email já existe em outro paciente
      const existingPacienteByEmail = await this.pacienteRepository.findByEmail(
        updatePacienteDto.email,
      );
      if (existingPacienteByEmail && existingPacienteByEmail.id !== id) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    // Validar telefone se fornecido
    if (
      updatePacienteDto.telefone &&
      !this.validacaoService.validarTelefone(updatePacienteDto.telefone)
    ) {
      throw new BadRequestException('Telefone inválido');
    }

    // Validar CEP se fornecido
    if (
      updatePacienteDto.endereco &&
      !this.validacaoService.validarCEP(updatePacienteDto.endereco.cep)
    ) {
      throw new BadRequestException('CEP inválido');
    }

    // Criar novo endereco se fornecido
    let endereco = paciente.endereco;
    if (updatePacienteDto.endereco) {
      endereco = new Endereco(
        updatePacienteDto.endereco.cep,
        updatePacienteDto.endereco.logradouro,
        updatePacienteDto.endereco.numero,
        updatePacienteDto.endereco.complemento || '',
        updatePacienteDto.endereco.bairro,
        updatePacienteDto.endereco.cidade,
        updatePacienteDto.endereco.estado,
      );
    }

    // Atualizar paciente
    const updatedPaciente = paciente.update(
      updatePacienteDto.nome || paciente.nome,
      updatePacienteDto.email || paciente.email,
      updatePacienteDto.telefone || paciente.telefone,
      endereco,
      updatePacienteDto.convenio !== undefined
        ? updatePacienteDto.convenio
        : paciente.convenio,
      updatePacienteDto.numeroConvenio !== undefined
        ? updatePacienteDto.numeroConvenio
        : paciente.numeroConvenio,
    );

    return await this.pacienteRepository.update(updatedPaciente);
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.findById(id);
    const deactivatedPaciente = paciente.deactivate();
    await this.pacienteRepository.update(deactivatedPaciente);
  }
}
