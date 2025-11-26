import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';
import { Prontuario } from '../entities/prontuario.entity';
import { Agendamento } from '../entities/agendamento.entity';

@Injectable()
export class LgpdService {
  constructor(
    @InjectRepository(Paciente)
    private pacienteRepository: Repository<Paciente>,
    @InjectRepository(Prontuario)
    private prontuarioRepository: Repository<Prontuario>,
    @InjectRepository(Agendamento)
    private agendamentoRepository: Repository<Agendamento>,
  ) {}

  async confirmarTratamento(userId: string) {
    // Buscar dados do usuário
    const paciente = await this.pacienteRepository.findOne({ where: { id: userId } });
    
    if (!paciente) {
      throw new BadRequestException('Paciente não encontrado');
    }

    return {
      confirmacao: true,
      dadosTratados: {
        dadosPessoais: ['nome', 'cpf', 'email', 'telefone', 'endereco'],
        dadosSaude: ['prontuarios', 'agendamentos', 'prescricoes'],
        finalidade: 'Prestação de serviços de saúde',
        baseLegal: 'Tutela da saúde (LGPD Art. 7º, VII)'
      },
      periodo: {
        inicio: paciente.createdAt,
        ultimaAtualizacao: paciente.updatedAt
      }
    };
  }

  async exportarDadosPaciente(userId: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id: userId } });
    
    if (!paciente) {
      throw new BadRequestException('Paciente não encontrado');
    }

    const prontuarios = await this.prontuarioRepository.find({
      where: { pacienteId: userId },
      relations: ['agendamento', 'medico']
    });

    const agendamentos = await this.agendamentoRepository.find({
      where: { pacienteId: userId },
      relations: ['medico']
    });

    return {
      dadosPessoais: {
        nome: paciente.nome,
        email: paciente.email,
        telefone: paciente.telefone,
        dataNascimento: paciente.dataNascimento,
        endereco: paciente.endereco,
        convenio: paciente.convenio,
        numeroConvenio: paciente.numeroConvenio,
        criadoEm: paciente.createdAt,
        atualizadoEm: paciente.updatedAt
      },
      historicoMedico: {
        totalProntuarios: prontuarios.length,
        prontuarios: prontuarios.map(p => ({
          data: p.createdAt,
          medico: p.medico?.nome,
          procedimentos: p.procedimentos,
          observacoes: p.observacoes,
          prescricoes: p.prescricoes
        })),
        totalAgendamentos: agendamentos.length,
        agendamentos: agendamentos.map(a => ({
          data: a.dataHora,
          tipo: a.tipo,
          status: a.status,
          medico: a.medico?.nome,
          observacoes: a.observacoes
        }))
      },
      metadados: {
        dataExportacao: new Date(),
        formato: 'JSON',
        versao: '1.0'
      }
    };
  }

  async anonimizarDados(userId: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id: userId } });
    
    if (!paciente) {
      throw new BadRequestException('Paciente não encontrado');
    }

    // Anonimizar dados pessoais
    const dadosAnonimizados = {
      nome: this.anonimizarNome(paciente.nome),
      email: this.anonimizarEmail(paciente.email),
      cpf: this.anonimizarCPF(paciente.cpf),
      telefone: this.anonimizarTelefone(paciente.telefone),
      endereco: 'ENDEREÇO ANONIMIZADO',
      isActive: false,
      anonimizadoEm: new Date()
    };

    await this.pacienteRepository.update(userId, dadosAnonimizados);

    // Anonimizar prontuários relacionados
    await this.prontuarioRepository.update(
      { pacienteId: userId },
      { 
        observacoes: 'DADOS ANONIMIZADOS POR SOLICITAÇÃO LGPD',
        anonimizado: true 
      }
    );

    return {
      sucesso: true,
      mensagem: 'Dados anonimizados com sucesso',
      dataAnonimizacao: new Date()
    };
  }

  async eliminarDados(userId: string, motivoEliminacao: string) {
    // Verificar se há impedimentos legais para eliminação
    const temProntuariosRecentes = await this.prontuarioRepository.count({
      where: { 
        pacienteId: userId,
        createdAt: MoreThan(new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000)) // 5 anos
      }
    });

    if (temProntuariosRecentes > 0) {
      throw new BadRequestException(
        'Não é possível eliminar dados com prontuários médicos dos últimos 5 anos (CFM Resolução 1.821/2007)'
      );
    }

    // Eliminar dados
    await this.prontuarioRepository.delete({ pacienteId: userId });
    await this.agendamentoRepository.delete({ pacienteId: userId });
    await this.pacienteRepository.delete(userId);

    return {
      sucesso: true,
      mensagem: 'Dados eliminados com sucesso',
      dataEliminacao: new Date(),
      motivo: motivoEliminacao
    };
  }

  async revogarConsentimento(userId: string, tipoConsentimento: string) {
    const paciente = await this.pacienteRepository.findOne({ where: { id: userId } });
    
    if (!paciente) {
      throw new BadRequestException('Paciente não encontrado');
    }

    // Atualizar consentimentos
    const consentimentosAtualizados = {
      ...paciente.consentimentos,
      [tipoConsentimento]: {
        concedido: false,
        dataRevogacao: new Date(),
        revogadoPorTitular: true
      }
    };

    await this.pacienteRepository.update(userId, {
      consentimentos: consentimentosAtualizados
    });

    return {
      sucesso: true,
      mensagem: `Consentimento '${tipoConsentimento}' revogado com sucesso`,
      dataRevogacao: new Date()
    };
  }

  private anonimizarNome(nome: string): string {
    const partes = nome.split(' ');
    return partes.map(parte => parte.length > 2 ? parte[0] + '*'.repeat(parte.length - 2) + parte[parte.length - 1] : parte).join(' ');
  }

  private anonimizarEmail(email: string): string {
    const [usuario, dominio] = email.split('@');
    const usuarioAnonimo = usuario[0] + '*'.repeat(Math.max(usuario.length - 2, 0)) + usuario[usuario.length - 1];
    return `${usuarioAnonimo}@${dominio}`;
  }

  private anonimizarCPF(cpf: string): string {
    return cpf.replace(/\d(?=\d{4})/g, '*');
  }

  private anonimizarTelefone(telefone: string): string {
    return telefone.replace(/\d(?=\d{4})/g, '*');
  }
}