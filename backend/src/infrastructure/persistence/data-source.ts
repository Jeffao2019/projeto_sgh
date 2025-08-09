import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: parseInt(configService.get('DB_PORT') || '5432', 10),
  username: configService.get('DB_USER') || 'sgh_user',
  password: configService.get('DB_PASSWORD') || 'sgh_password',
  database: configService.get('DB_NAME') || 'sgh_database',
  ssl: configService.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false, // Never use synchronize in production
  logging: configService.get('DB_LOGGING') === 'true',
  entities: [__dirname + '/entities/*.js'],
  migrations: [__dirname + '/migrations/*.js'],
  migrationsTableName: 'migrations',
});
