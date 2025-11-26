import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        unidadeId: string;
        unidade: any;
        isMatriz: boolean;
      };
    }
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let unidadeId = req.headers['x-unidade-id'] as string ||
                     req.query.unidadeId as string;

      if (!unidadeId && req.user) {
        unidadeId = req.user.unidadeId;
      }

      if (unidadeId) {
        req.tenant = {
          unidadeId: unidadeId,
          unidade: null,
          isMatriz: false
        };
      }

      next();
    } catch (error) {
      throw new BadRequestException('Erro ao processar tenant: ' + error.message);
    }
  }
}