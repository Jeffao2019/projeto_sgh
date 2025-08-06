import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../tokens/injection.tokens';

interface RequestWithHeaders {
  headers?: {
    authorization?: string;
  };
}

const extractJwtFromRequest = (req: RequestWithHeaders): string | null => {
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      console.log('JWT extracted successfully');
      return parts[1];
    }
    console.log('Invalid authorization header format:', authHeader);
  } else {
    console.log('No authorization header found');
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    console.log('JWT payload received:', payload);

    const user = await this.userRepository.findById(payload.sub);
    console.log('User found in database:', !!user);

    if (!user) {
      console.log('User not found with ID:', payload.sub);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!user.isActive) {
      console.log('User is inactive:', payload.sub);
      throw new UnauthorizedException('Usuário inativo');
    }

    const userResponse = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nome: user.nome,
      telefone: user.telefone,
    };

    console.log('User validated successfully:', userResponse);
    return userResponse;
  }
}
