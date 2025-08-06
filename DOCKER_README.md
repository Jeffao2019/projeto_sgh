# SGH - Sistema de Gestão Hospitalar - Docker

Este projeto contém a configuração Docker para o Sistema de Gestão Hospitalar (SGH) com backend NestJS e frontend React.

## 🚀 Como usar

### Pré-requisitos

- Docker
- Docker Compose

### Executar o projeto

1. **Clone o repositório e navegue para a pasta do projeto:**

```bash
cd /home/jeffao/projects/Projeto_SGH
```

2. **Construir e executar os containers:**

```bash
docker-compose up --build
```

3. **Executar em segundo plano (detached):**

```bash
docker-compose up -d --build
```

4. **Verificar logs:**

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

5. **Parar os containers:**

```bash
docker-compose down
```

6. **Parar e remover volumes:**

```bash
docker-compose down -v
```

## 📋 Serviços

### Backend (NestJS)

- **Porta:** 3000
- **URL:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### Frontend (React + Nginx)

- **Porta:** 80
- **URL:** http://localhost

## 🔧 Configurações

### Variáveis de Ambiente

Você pode customizar as seguintes variáveis no `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - JWT_SECRET=your-super-secret-jwt-key-here
  - PORT=3000
```

### Banco de Dados (Opcional)

Para habilitar PostgreSQL, descomente as linhas no `docker-compose.yml`:

```yaml
postgres:
  image: postgres:15-alpine
  container_name: sgh-postgres
  environment:
    POSTGRES_DB: sgh_database
    POSTGRES_USER: sgh_user
    POSTGRES_PASSWORD: sgh_password
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

### Redis (Opcional)

Para habilitar Redis, descomente as linhas no `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: sgh-redis
  ports:
    - "6379:6379"
```

## 🔍 Comandos úteis

```bash
# Reconstruir apenas um serviço
docker-compose build backend
docker-compose build frontend

# Executar apenas um serviço
docker-compose up backend
docker-compose up frontend

# Acessar shell do container
docker-compose exec backend sh
docker-compose exec frontend sh

# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f --tail=100

# Limpar tudo (containers, redes, volumes)
docker-compose down --volumes --remove-orphans
docker system prune -a
```

## 🐛 Troubleshooting

### Porta já em uso

Se as portas 80 ou 3000 estiverem em uso, modifique no `docker-compose.yml`:

```yaml
ports:
  - "8080:80" # Frontend na porta 8080
  - "3001:3000" # Backend na porta 3001
```

### Problemas de build

```bash
# Limpar cache do Docker
docker builder prune

# Rebuild sem cache
docker-compose build --no-cache
```

### Problemas de rede

```bash
# Recriar network
docker network prune
docker-compose up --force-recreate
```

## 📁 Estrutura do projeto

```
Projeto_SGH/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
└── DOCKER_README.md
```

## 🔒 Produção

Para usar em produção, considere:

1. **Variáveis de ambiente seguras:**

   - Use um `.env` file
   - Configure JWT_SECRET adequadamente
   - Configure DATABASE_URL se usar banco

2. **HTTPS:**

   - Configure SSL/TLS
   - Use reverse proxy (nginx, traefik)

3. **Monitoramento:**

   - Configure health checks
   - Use ferramentas de log (ELK stack)
   - Configure alertas

4. **Backup:**
   - Configure backup automático do banco
   - Backup dos volumes Docker
