# CarboAPI

API para gerenciamento de biodiversidade da Carbonífera.

## Pré-requisitos
- Node.js 18+
- Banco de dados PostgreSQL

## Configuração
1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd backendcarbonifera
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o arquivo `.env`:**
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste para o seu banco):
   ```env
   DATABASE_URL="postgresql://usuario:senha@host:5432/nome_do_banco?sslmode=require"
   JWT_SECRET="sua_chave_secreta"
   ```

## Comandos principais

- **Gerar o client do Prisma:**
  ```bash
  npx prisma generate
  ```
- **Atualizar os modelos Prisma a partir do banco:**
  ```bash
  npx prisma db pull
  ```
- **Rodar o servidor em produção:**
  ```bash
  npm start
  ```
- **Rodar em modo desenvolvimento:**
  ```bash
  npm run dev
  ```

## Documentação da API

Após iniciar o servidor, acesse a documentação Swagger em:

[http://localhost:3333/docs](http://localhost:3333/docs)

## Observações
- O arquivo `.env` está no `.gitignore` e **não deve ser versionado**.
- O Prisma Client é gerado em `src/generated/prisma`.
- Para rodar testes ou comandos adicionais, consulte os scripts no `package.json`. 