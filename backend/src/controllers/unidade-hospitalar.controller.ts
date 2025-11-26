import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UnidadeHospitalarService } from '../services/unidade-hospitalar.service';
import { TipoUnidade, StatusUnidade } from '../domain/unidade-hospitalar.entity';

@Controller('unidades-hospitalares')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UnidadeHospitalarController {
  constructor(private readonly unidadeService: UnidadeHospitalarService) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() createDto: any) {
    return await this.unidadeService.create(createDto);
  }

  @Get()
  @Roles('ADMIN', 'MEDICO')
  async findAll(
    @Query('tipo') tipo?: TipoUnidade,
    @Query('status') status?: StatusUnidade,
    @Query('cidade') cidade?: string,
    @Query('estado') estado?: string,
    @Query('apenasMatriz') apenasMatriz?: string,
  ) {
    const filtros = {
      tipo,
      status,
      cidade,
      estado,
      apenasMatriz: apenasMatriz === 'true'
    };

    return await this.unidadeService.findAll(filtros);
  }

  @Get('estatisticas')
  @Roles('ADMIN')
  async obterEstatisticas() {
    return await this.unidadeService.obterEstatisticas();
  }

  @Get(':id')
  @Roles('ADMIN', 'MEDICO')
  async findOne(@Param('id') id: string) {
    return await this.unidadeService.findOne(id);
  }
}