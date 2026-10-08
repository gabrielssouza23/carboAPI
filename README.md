# carboAPI

API REST da plataforma **Carbonífera Biodiversa**, um catálogo colaborativo de fauna e flora da Região Carbonífera do Rio Grande do Sul, desenvolvido no IFSul.

A API serve o catálogo de espécies, recebe contribuições da comunidade (fotos com geolocalização) e usa um modelo de visão (Llama 3.2 90B Vision, via NVIDIA API) para sugerir a identificação de espécies a partir de uma imagem.

## Stack

- **Node.js** + **Fastify 5** (ES Modules)
- **PostgreSQL** com o driver [`postgres`](https://github.com/porsager/postgres) (queries com tagged templates)
- **JWT** (`jsonwebtoken`) para autenticação das rotas administrativas
- **ImgBB** para hospedagem das imagens enviadas
- **NVIDIA API** (Llama 3.2 90B Vision) para análise de imagens

## Arquitetura

```
src/
├── server.js          # instância do Fastify, CORS, multipart e registro das rotas
├── routes/            # definição das rotas por domínio (species, admins, generic)
├── controllers/       # integrações externas: upload no ImgBB e análise de imagem por IA
├── models/            # acesso ao banco (SQL)
├── plugins/
│   └── authPlugin.js  # decorator `fastify.authenticate` que valida o Bearer token
└── dbConn/db.js       # conexão com o Postgres
```

As rotas são registradas a partir de uma lista em `routes/index.js`, cada uma com seu prefixo. Rotas protegidas usam `preHandler: [fastify.authenticate]`.

## Endpoints

### Espécies (`/species`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/species/specie/:specieId` | — | Detalhes de uma espécie, com imagens e referências |
| GET | `/species/species-all-catalog?limit=10&offset=0` | — | Catálogo paginado (id, nomes e thumb) |
| GET | `/species/species-count` | — | Total de espécies cadastradas |
| GET | `/species/species-all-crud` | — | Todas as espécies com todos os campos |
| GET | `/species/specie-contributions/:specieId` | — | Imagens enviadas pela comunidade para a espécie |
| GET | `/species/specie-locations/:specieId` | — | Coordenadas das contribuições da espécie |
| POST | `/species/specie-create` | JWT | Cadastra espécie, sobe a thumb e as imagens extras no ImgBB |
| POST | `/species/contribution-create` | — | Registra contribuição: fotos + latitude/longitude/data |
| POST | `/species/analyze-image` | — | Envia a URL de uma imagem para identificação por IA |

### Administração (`/admins`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/admins/admins-login` | Login com `email` e `senha`; retorna um JWT válido por 1h |

### Geral (`/generic`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/generic/participacao` | Registra interesse em participar do projeto (`name`, `origin`, `message`, `contact`) |

Exemplos de requisição estão em [`route.http`](./route.http) (extensão REST Client do VS Code).

## Rodando localmente

Pré-requisitos: Node.js 18+ e um banco PostgreSQL com as tabelas do projeto (`especies`, `speciesImage`, `specieReferences`, `specieContributionImg`, `admins`, `participacoes`).

```bash
npm install
```

Crie um `.env` na raiz:

```env
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=
ENDPOINT_ID=        # ID do endpoint (Neon)
JWT_SECRET=
IMGBB_API_KEY=
NVIDIA_API=
PORT=3333           # opcional, padrão 3333
```

Inicie o servidor:

```bash
node index.js
# ou, com reload automático:
node --watch index.js
```

A API sobe em `http://localhost:3333`.
