# Bingo Driven - Back-end

API do jogo de Bingo, desenvolvida com **Node.js**, **Express**, **TypeScript** e **Prisma**, utilizando **PostgreSQL** como banco de dados relacional.

> **Node.js >= 20.x** é necessário para executar este projeto.

## Deploy

| Ambiente   | URL                                                    |
| ---------- | ------------------------------------------------------ |
| Produção   | https://bingo-driven-backend-zttw.onrender.com         |
| API Health | https://bingo-driven-backend-zttw.onrender.com/health  |

## Arquitetura

O projeto segue a **arquitetura em camadas**, separando responsabilidades de forma clara:

```
src/
├── config/          # Regras e constantes do bingo
├── controllers/     # Recebe requisições e delega para services
├── services/        # Regras de negócio
├── repositories/    # Acesso ao banco de dados via Prisma
├── routers/         # Definição de rotas Express
├── middlewares/     # Tratamento de erros
├── errors/          # Definição de erros customizados
├── database/        # Instância do Prisma Client
├── utils/           # Funções utilitárias
├── app.ts           # Configuração do Express
└── server.ts        # Ponto de entrada da aplicação
```

## Endpoints da API

| Método  | Rota                  | Descrição                          |
| ------- | --------------------- | ---------------------------------- |
| GET     | `/health`             | Health check da aplicação          |
| GET     | `/games/:id`          | Busca um jogo pelo ID              |
| POST    | `/games/start`        | Inicia um novo jogo de bingo       |
| PATCH   | `/games/number/:id`   | Sorteia o próximo número do jogo   |
| PATCH   | `/games/finish/:id`   | Finaliza um jogo                   |

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bingo_db?schema=public"
PORT=5000
```

Para o ambiente de testes, o arquivo `.env.test` é utilizado:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=bingo_test
DATABASE_URL="postgresql://postgres:sua_senha@postgres:5432/bingo_test?schema=public"
PORT=5000
```

## Rodando Localmente (sem Docker)

**Pré-requisitos:** Node.js >= 20.x, npm e uma instância de PostgreSQL rodando.

```bash
# 1. Instale as dependências
npm install

# 2. Configure o .env com a DATABASE_URL apontando para seu PostgreSQL

# 3. Execute as migrations do Prisma
npx prisma migrate dev

# 4. Inicie o servidor em modo de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5000`.

## Rodando com Docker

### Com Docker Compose (recomendado)

O Docker Compose sobe a aplicação e o banco de dados PostgreSQL automaticamente, com volume para persistência de dados.

```bash
# 1. Crie o arquivo .env na raiz (veja a seção "Variáveis de Ambiente")
#    Para o compose de desenvolvimento, o host do banco deve ser o nome do serviço:
#    DATABASE_URL="postgresql://postgres:sua_senha@postgres-dev:5432/mydb?schema=public"

# 2. Suba os containers
docker compose -f docker-compose-dev.yml up --build
```

A aplicação estará disponível em `http://localhost:5001` e o PostgreSQL em `localhost:5432`.

Para parar os containers:

```bash
docker compose -f docker-compose-dev.yml down
```

Para remover também os volumes (dados do banco):

```bash
docker compose -f docker-compose-dev.yml down -v
```

### Sem Docker Compose

Se preferir subir os containers manualmente:

```bash
# 1. Crie uma rede Docker para comunicação entre os containers
docker network create bingo-network

# 2. Suba o PostgreSQL
docker run -d \
  --name bingo-postgres \
  --network bingo-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=sua_senha \
  -e POSTGRES_DB=bingo_db \
  -p 5432:5432 \
  -v bingo-pgdata:/var/lib/postgresql/data \
  postgres:16-alpine

# 3. Construa a imagem da aplicação
docker build -t bingo-backend .

# 4. Suba o container da aplicação
docker run -d \
  --name bingo-backend \
  --network bingo-network \
  -e DATABASE_URL="postgresql://postgres:sua_senha@bingo-postgres:5432/bingo_db?schema=public" \
  -p 5000:5000 \
  bingo-backend
```

A aplicação estará disponível em `http://localhost:5000`.

Para parar e remover os containers:

```bash
docker stop bingo-backend bingo-postgres
docker rm bingo-backend bingo-postgres
docker network rm bingo-network
```

## Testes

O projeto possui testes de integração escritos com **Jest** e **Supertest**.

### Rodando testes localmente

Requer um PostgreSQL acessível conforme configurado no `.env.test`:

```bash
npm test
```

### Rodando testes com Docker Compose

```bash
docker compose -f docker-compose-test.yml up --build --exit-code-from backend
```

## Dockerização

- **Dockerfile** (produção): imagem baseada em `node:alpine` com build TypeScript, otimizada para tamanho reduzido.
- **Dockerfile.dev** (desenvolvimento): imagem baseada em `node:alpine` com hot-reload via `ts-node-dev`.
- A imagem de produção é publicada automaticamente no **Docker Hub** pelo pipeline de CD.

## Pipeline CI/CD

O pipeline é executado via **GitHub Actions** em pushes e pull requests para a branch `main`.

```
Push/PR para main
       │
       ▼
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  CI - Testes │────▶│  CD - Docker Hub   │────▶│  CD - Render     │
│  (Jest)      │     │  (Build & Push)    │     │  (Deploy)        │
└──────────────┘     └───────────────────┘     └──────────────────┘
```

1. **CI**: Executa os testes de integração. Se falharem, o deploy é bloqueado.
2. **CD - Docker Hub**: Builda a imagem Docker e publica no Docker Hub.
3. **CD - Render**: Dispara o deploy na plataforma Render.

### GitHub Secrets utilizados

| Secret             | Descrição                          |
| ------------------ | ---------------------------------- |
| `DOCKER_USERNAME`  | Usuário do Docker Hub              |
| `DOCKER_PASSWORD`  | Senha/token do Docker Hub          |
| `SERVICE_ID`       | ID do serviço no Render            |
| `RENDER_API_KEY`   | Chave de API do Render             |

## Tecnologias

| Categoria      | Tecnologia                    |
| -------------- | ----------------------------- |
| Runtime        | Node.js >= 20.x              |
| Linguagem      | TypeScript                    |
| Framework      | Express                       |
| ORM            | Prisma                        |
| Banco de Dados | PostgreSQL                    |
| Validação      | Joi                           |
| Testes         | Jest + Supertest              |
| Containerização| Docker + Docker Compose       |
| CI/CD          | GitHub Actions                |
| Hospedagem     | Render                        |
| Registro Docker| Docker Hub                    |
