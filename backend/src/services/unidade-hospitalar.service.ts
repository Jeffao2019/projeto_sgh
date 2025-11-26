import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnidadeHospitalar, TipoUnidade, StatusUnidade } from '../domain/unidade-hospitalar.entity';

@Injectable()
export class UnidadeHospitalarService {
  constructor(
    @InjectRepository(UnidadeHospitalar)
    private unidadeRepository: Repository<UnidadeHospitalar>,
  ) {}

  async create(createDto: any): Promise<UnidadeHospitalar> {
    const existingUnidade = await this.unidadeRepository.findOne({
      where: { codigo: createDto.codigo }
    });

    if (existingUnidade) {
      throw new ConflictException('Código da unidade já está em uso');
    }

    const unidade = this.unidadeRepository.create(createDto);
    return await this.unidadeRepository.save(unidade);
  }

  async findAll(filtros?: any): Promise<UnidadeHospitalar[]> {
    const options: any = {
      order: { nome: 'ASC' }
    };

    if (filtros) {
      const where: any = {};
      
      if (filtros.tipo) where.tipo = filtros.tipo;
      if (filtros.status) where.status = filtros.status;
      if (filtros.cidade) where.cidade = filtros.cidade;
      if (filtros.estado) where.estado = filtros.estado;
      if (filtros.apenasMatriz) where.isMatriz = true;

      options.where = where;
    }

    return await this.unidadeRepository.find(options);
  }

  async findOne(id: string): Promise<UnidadeHospitalar> {
    const unidade = await this.unidadeRepository.findOne({
      where: { id }
    });

    if (!unidade) {
      throw new NotFoundException('Unidade hospitalar não encontrada');
    }

    return unidade;
  }

  async obterEstatisticas(): Promise<any> {
    const unidades = await this.findAll({ status: StatusUnidade.ATIVA });

    const estatisticas = {
      totalUnidades: unidades.length,
      porTipo: {},
      capacidadeTotal: {
        leitos: 0,
        uti: 0
      },
      distribuicaoGeografica: {},
      unidadesAtivas: 0,
      unidadesInativas: 0
    };

    unidades.forEach(unidade => {
      estatisticas.porTipo[unidade.tipo] = (estatisticas.porTipo[unidade.tipo] || 0) + 1;
      estatisticas.capacidadeTotal.leitos += unidade.capacidadeLeitos;
      estatisticas.capacidadeTotal.uti += unidade.capacidadeUTI;

      if (unidade.estado) {
        estatisticas.distribuicaoGeografica[unidade.estado] = 
          (estatisticas.distribuicaoGeografica[unidade.estado] || 0) + 1;
      }

      if (unidade.status === StatusUnidade.ATIVA) {
        estatisticas.unidadesAtivas++;
      } else {
        estatisticas.unidadesInativas++;
      }
    });

    return estatisticas;
  }
}