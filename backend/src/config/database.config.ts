import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USER', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_NAME', 'sgh'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
  
  // Configurações de pool para performance
  extra: {
    // Pool de conexões
    max: 20, // Máximo de conexões
    min: 5,  // Mínimo de conexões
    
    // Timeout configurations
    connectionTimeoutMillis: 30000, // 30s
    idleTimeoutMillis: 30000,       // 30s
    acquireTimeoutMillis: 60000,    // 60s
    
    // Keep alive
    keepAlive: true,
    keepAliveInitialDelayMillis: 0,
    
    // Statement timeout
    statement_timeout: 30000, // 30s
    
    // Query optimization
    application_name: 'SGH-Hospital',
  },
  
  // Cache de consultas
  cache: {
    type: 'redis',
    options: {
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
      password: configService.get('REDIS_PASSWORD'),
    },
    duration: 30000, // 30 segundos
  },
  
  // Retry logic
  retryAttempts: 3,
  retryDelay: 3000,
});