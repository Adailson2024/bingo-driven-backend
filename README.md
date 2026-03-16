Lindo Deploy: https://bingo-driven-backend-zttw.onrender.com

# 🎰 Bingo Driven - Back-end

Este é o servidor da aplicação Bingo Driven, desenvolvido com Node.js, TypeScript, Prisma e PostgreSQL.

## 🚀 Como subir o projeto com Docker

Você pode rodar esta aplicação localmente utilizando o Docker de duas maneiras: com Docker Compose (recomendado) ou manualmente via Dockerfile.

### 1. Utilizando Docker Compose (Recomendado)
O Docker Compose sobe automaticamente a aplicação e o banco de dados PostgreSQL com os volumes configurados para persistência.

**Passo a passo:**
1. Certifique-se de ter um arquivo `.env` na raiz com a variável `DATABASE_URL`.
   * Exemplo: `DATABASE_URL="postgresql://user:password@db:5432/bingo_db?schema=public"`
2. No terminal, execute:
   ```bash
   docker-compose up --build
