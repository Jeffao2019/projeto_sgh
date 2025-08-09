# SGH Backend - Database Setup

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Environment Setup

1. Copy the environment example file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database configuration

## Docker Setup (Recommended)

1. Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d postgres
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npm run migration:run
```

4. Start the application:
```bash
npm run start:dev
```

## Local PostgreSQL Setup

If you prefer to run PostgreSQL locally:

1. Install PostgreSQL
2. Create a database named `sgh_database`
3. Create a user `sgh_user` with password `sgh_password`
4. Update the `.env` file with your local database configuration
5. Run migrations and start the application as described above

## Database Commands

- **Run migrations**: `npm run migration:run`
- **Revert last migration**: `npm run migration:revert`
- **Generate new migration**: `npm run migration:generate -- src/infrastructure/persistence/migrations/MigrationName`
- **Reset database**: `npm run db:create`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `sgh_database` |
| `DB_USER` | Database user | `sgh_user` |
| `DB_PASSWORD` | Database password | `sgh_password` |
| `DB_SSL` | Enable SSL | `false` |
| `DB_SYNCHRONIZE` | Auto-sync entities (dev only) | `true` |
| `DB_LOGGING` | Enable query logging | `true` |

## Database Schema

The application uses the following main entities:
- **Users**: System users (doctors, receptionists, admins)
- **Pacientes**: Patient information
- **Agendamentos**: Appointment scheduling
- **Prontuarios**: Medical records

## Production Notes

- Set `DB_SYNCHRONIZE=false` in production
- Use proper SSL configuration
- Run migrations manually in production
- Use environment-specific database credentials
