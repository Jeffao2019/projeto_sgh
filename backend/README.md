# Sistema de Gestão Hospitalar (SGH) - Backend

Este é o backend do Sistema de Gestão Hospitalar desenvolvido com NestJS, seguindo os princípios da Clean Architecture.

## 🏗️ Arquitetura

O projeto segue a Clean Architecture com as seguintes camadas:

```
src/
├── domain/              # Camada de Domínio
│   ├── entities/        # Entidades de domínio
│   ├── repositories/    # Interfaces dos repositórios
│   └── services/        # Serviços de domínio
├── application/         # Camada de Aplicação
│   ├── dto/            # Data Transfer Objects
│   └── use-cases/      # Casos de uso
└── infrastructure/      # Camada de Infraestrutura
    ├── controllers/     # Controllers REST
    ├── persistence/     # Implementações de repositórios
    ├── modules/         # Módulos NestJS
    ├── guards/          # Guards de autenticação
    └── auth/            # Estratégias de autenticação
```

## 🚀 Funcionalidades

### ✅ Implementadas

- **Autenticação JWT**
  - Registro de usuários
  - Login
  - Alteração de senha
  - Proteção de rotas

- **Gestão de Pacientes**
  - CRUD completo
  - Validação de CPF
  - Busca por nome, CPF ou email
  - Paginação

- **Gestão de Agendamentos**
  - Criação de agendamentos
  - Verificação de disponibilidade
  - Status de agendamento (agendado, confirmado, cancelado, etc.)
  - Filtros por paciente, médico e período

- **Gestão de Prontuários**
  - Criação e edição de prontuários
  - Vinculação com agendamentos
  - Histórico por paciente e médico

### 🔒 Segurança e Validações

- Autenticação JWT
- Validação de entrada com class-validator
- Validação de CPF, email, telefone e CEP
- Proteção contra dados duplicados
- Sanitização de dados

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem tipada
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **class-validator** - Validação de dados
- **class-transformer** - Transformação de dados

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🚀 Como executar

1. **Instalar dependências**

```bash
npm install
```

2. **Configurar variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Executar em desenvolvimento**

```bash
npm run start:dev
```

4. **Executar em produção**

```bash
npm run build
npm run start:prod
```

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Inicia em modo desenvolvimento com watch
npm run start:debug    # Inicia em modo debug

# Build
npm run build          # Compila o projeto

# Produção
npm run start:prod     # Inicia em modo produção

# Testes
npm run test           # Executa testes unitários
npm run test:watch     # Executa testes em modo watch
npm run test:cov       # Executa testes com coverage
npm run test:e2e       # Executa testes end-to-end

# Linting
npm run lint           # Executa ESLint
npm run format         # Formata código com Prettier
```

## 🔌 Endpoints da API

A documentação completa dos endpoints está disponível no arquivo [ENDPOINTS.md](../ENDPOINTS.md).

### Principais endpoints:

- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login
- `GET /pacientes` - Listar pacientes
- `POST /pacientes` - Criar paciente
- `GET /agendamentos` - Listar agendamentos
- `POST /agendamentos` - Criar agendamento
- `GET /prontuarios` - Listar prontuários
- `POST /prontuarios` - Criar prontuário

## 🧪 Testes

O projeto inclui testes unitários para os casos de uso principais. Para executar:

```bash
# Todos os testes
npm run test

# Testes com coverage
npm run test:cov

# Testes em modo watch
npm run test:watch
```

## 📝 Exemplos de Uso

### Registrar usuário

```bash
curl -X POST http://localhost:3000/auth/register
  -H "Content-Type: application/json"
  -d '{
    "email": "medico@hospital.com",
    "password": "senha123",
    "nome": "Dr. João Silva",
    "role": "MEDICO"
  }'
```

### Criar paciente

```bash
curl -X POST http://localhost:3000/pacientes
  -H "Content-Type: application/json"
  -H "Authorization: Bearer {seu-token}"
  -d '{
    "nome": "João Silva",
    "cpf": "12345678900",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "dataNascimento": "1990-01-15",
    "endereco": {
      "cep": "01234567",
      "logradouro": "Rua das Flores",
      "numero": "123",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP"
    }
  }'
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 📦 Estrutura de Dados

### Usuário

- id, email, password, nome, role, createdAt, updatedAt, isActive

### Paciente

- id, nome, cpf, email, telefone, dataNascimento, endereco, convenio, numeroConvenio

### Agendamento

- id, pacienteId, medicoId, dataHora, tipo, status, observacoes

### Prontuário

- id, pacienteId, medicoId, agendamentoId, dataConsulta, anamnese, exameFisico, diagnostico, prescricao

## 👥 Requisitos do Projeto

Este projeto atende aos seguintes requisitos funcionais e não funcionais baseados no documento de especificação:

### ✅ Requisitos Funcionais

- **RF001**: Cadastro de pacientes com validação de CPF
- **RF002**: Sistema de autenticação com JWT
- **RF003**: Gestão de agendamentos com verificação de disponibilidade
- **RF004**: Prontuários eletrônicos vinculados aos agendamentos
- **RF005**: Validações de segurança e LGPD

### ✅ Requisitos Não Funcionais

- **RNF001**: Arquitetura limpa e escalável
- **RNF002**: Validação rigorosa de dados de entrada
- **RNF003**: Criptografia de senhas
- **RNF004**: Logs de auditoria (preparado para implementação)
- **RNF005**: Tratamento de erros padronizado

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
