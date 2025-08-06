import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      console.error('JWT Auth Error:', {
        error: err instanceof Error ? err.message : 'Unknown error',
        info: typeof info === 'string' ? info : JSON.stringify(info),
        hasUser: !!user,
      });

      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return user as TUser;
  }
}
