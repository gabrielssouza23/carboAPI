# carboAPI

REST API for **[Carbonífera Biodiversa](https://github.com/gabrielssouza23/carboniferaBiodiversa)**, a collaborative catalog of the fauna and flora of the coal-mining region of Rio Grande do Sul, Brazil, built at IFSul.

The API serves the species catalog, receives community contributions (geotagged photos) and uses a vision model (Llama 3.2 90B Vision, through the NVIDIA API) to suggest which species appear in a photo.

## Stack

- **Node.js** + **Fastify 5** (ES Modules)
- **PostgreSQL** with the [`postgres`](https://github.com/porsager/postgres) driver (tagged-template queries)
- **JWT** (`jsonwebtoken`) for the admin routes
- **ImgBB** to host uploaded images
- **NVIDIA API** (Llama 3.2 90B Vision) for image analysis

## Architecture

```
src/
├── server.js          # Fastify instance, CORS, multipart and route registration
├── routes/            # routes per domain (species, admins, generic)
├── controllers/       # external integrations: ImgBB uploads and AI image analysis
├── models/            # database access (SQL)
├── plugins/
│   └── authPlugin.js  # `fastify.authenticate` decorator that validates the Bearer token
└── dbConn/db.js       # Postgres connection
```

Routes are registered from a list in `routes/index.js`, each under its own prefix. Protected routes use `preHandler: [fastify.authenticate]`.

## Endpoints

### Species (`/species`)

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/species/specie/:specieId` | — | Species details, with images and references |
| GET | `/species/species-all-catalog?limit=10&offset=0` | — | Paginated catalog (id, names and thumbnail) |
| GET | `/species/species-count` | — | Total number of species |
| GET | `/species/species-all-crud` | — | All species with every field |
| GET | `/species/specie-contributions/:specieId` | — | Community photos for a species |
| GET | `/species/specie-locations/:specieId` | — | Coordinates of a species' sightings |
| POST | `/species/specie-create` | JWT | Creates a species and uploads its thumbnail and extra images to ImgBB |
| POST | `/species/contribution-create` | — | Saves a contribution: photos + latitude/longitude/date |
| POST | `/species/analyze-image` | — | Sends an image URL to the vision model for identification |

### Admin (`/admins`)

| Method | Route | Description |
|---|---|---|
| POST | `/admins/admins-login` | Login with `email` and `senha`; returns a JWT valid for 1 hour |

### General (`/generic`)

| Method | Route | Description |
|---|---|---|
| POST | `/generic/participacao` | Registers interest in joining the project (`name`, `origin`, `message`, `contact`) |

Request examples are in [`route.http`](./route.http) (VS Code REST Client).

## Running locally

Requirements: Node.js 18+ and a PostgreSQL database with the project tables (`especies`, `speciesImage`, `specieReferences`, `specieContributionImg`, `admins`, `participacoes`).

```bash
npm install
```

Create a `.env` file in the root:

```env
PGHOST=
PGDATABASE=
PGUSER=
PGPASSWORD=
ENDPOINT_ID=        # Neon endpoint ID
JWT_SECRET=
IMGBB_API_KEY=
NVIDIA_API=
PORT=3333           # optional, defaults to 3333
```

Start the server:

```bash
node index.js
# or, with auto-reload:
node --watch index.js
```

The API runs at `http://localhost:3333`.
