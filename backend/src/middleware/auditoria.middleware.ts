import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditoriaService } from '../services/auditoria.service';

@Injectable()
export class AuditoriaMiddleware implements NestMiddleware {
  constructor(private auditoriaService: AuditoriaService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;
    const startTime = Date.now();

    res.send = function(data) {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      const success = statusCode < 400;

      // Registrar apenas ações importantes
      if (req.user && req.method !== 'GET' || req.path.includes('/auth/')) {
        const action = `${req.method} ${req.path}`;
        
        const auditoriaData = {
          userId: req.user?.id || 'ANONIMO',
          userRole: req.user?.role || 'DESCONHECIDO',
          action: action,
          resource: req.path,
          details: {
            method: req.method,
            statusCode,
            responseTime,
            body: req.method !== 'GET' ? req.body : undefined
          },
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent') || '',
          success
        };

        // Não aguardar o resultado para não afetar performance
        this.auditoriaService.registrarAcao(auditoriaData).catch(console.error);
      }

      return originalSend.call(this, data);
    }.bind(res);

    next();
  }
}