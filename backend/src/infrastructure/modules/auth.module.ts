import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { CryptographyService } from '../../domain/services/cryptography.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthController } from '../controllers/auth.controller';
import { PersistenceModule } from '../persistence/persistence.module';
import {
  CRYPTOGRAPHY_SERVICE,
  USER_REPOSITORY,
} from '../tokens/injection.tokens';

@Module({
  imports: [
    PassportModule,
    PersistenceModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    JwtStrategy,
    {
      provide: CRYPTOGRAPHY_SERVICE,
      useClass: CryptographyService,
    },
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
