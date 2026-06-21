# WeatherPro

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Tests](https://img.shields.io/badge/tests-32%20passing-brightgreen)

A production-grade full-stack weather application. Search any location worldwide, view current conditions and a 5-day forecast, save records to PostgreSQL, explore the location via an interactive map and curated YouTube videos, and export your data in JSON, CSV, Markdown, or PDF.

---

## Features

| # | Feature | Details |
|---|---|---|
| 1 | Universal search | City, country, zip code, GPS coordinates, landmark |
| 2 | GPS location | One-click "Use My Location" via browser Geolocation API |
| 3 | Current weather | Temperature, feels-like, humidity, wind, pressure, visibility, cloud cover |
| 4 | Local time | Displays the location's current time and UTC offset |
| 5 | 5-day forecast | Responsive daily forecast grid |
| 6 | AI weather assistant | Clothing, travel, and activity tips powered by live weather data |
| 7 | Interactive map | Leaflet + OpenStreetMap with animated fly-to on location change |
| 8 | YouTube videos | Curated travel/tourism videos for the searched location |
| 9 | Full CRUD | Create, read, update, delete weather records in PostgreSQL |
| 10 | Pagination & search | Server-side pagination, sorting, and text search on records |
| 11 | Export | JSON · CSV · Markdown · PDF (client-side, no server dependency) |
| 12 | Responsive design | Mobile-first with TailwindCSS |
| 13 | Rate limiting | Global + per-route request throttling |
| 14 | Security headers | Helmet.js on all responses |

---

## Tech Stack

### Frontend

| Package | Version | Role |
|---|---|---|
| Next.js | 15 | App framework (App Router, RSC) |
| React | 19 | UI library |
| TypeScript | 5 | Strict type safety |
| TailwindCSS | 3 | Utility-first styling |
| Axios | 1 | HTTP client with interceptors |
| React Hook Form + Zod | 7 / 3 | Form handling and validation |
| Leaflet + react-leaflet | 1 / 4 | Interactive map |
| jsPDF + autotable | 4 / 5 | Client-side PDF generation |
| lucide-react | latest | Icon set |
| date-fns | 4 | Date formatting |

### Backend

| Package | Version | Role |
|---|---|---|
| Express.js | 4 | HTTP server |
| Node.js | 20 | Runtime |
| TypeScript | 5 | Type safety |
| PostgreSQL | 16 | Primary database |
| Prisma ORM | 5 | Type-safe DB access + migrations |
| Zod | 3 | Request validation |
| Axios | 1 | External API calls (OWM, Nominatim) |
| Helmet | 8 | Security headers |
| express-rate-limit | 8 | Request throttling |
| Morgan | 1 | HTTP request logging |
| Jest + ts-jest + Supertest | 30 / 29 / 7 | Testing |

### External APIs

| API | Purpose |
|---|---|
| [OpenWeatherMap](https://openweathermap.org/api) | Current weather + 5-day forecast |
| [OpenStreetMap Nominatim](https://nominatim.org/) | Geocoding + location suggestions |
| [YouTube Data API v3](https://developers.google.com/youtube/v3) | Travel video search |

---

## Architecture

```
weather-app/
├── frontend/                     # Next.js 15 (App Router)
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/
│       │   ├── ui/               # ErrorBoundary, loading states
│       │   ├── layout/           # Header, Footer
│       │   ├── weather/          # SearchBar, WeatherCard, WeatherDetails,
│       │   │                     # ForecastCard, AIAssistant
│       │   ├── crud/             # RecordForm, RecordList
│       │   ├── map/              # WeatherMap → MapClient (Leaflet, SSR-safe)
│       │   ├── youtube/          # VideoGrid
│       │   └── export/           # ExportButtons (JSON/CSV/MD/PDF)
│       ├── hooks/                # useRecords
│       ├── lib/                  # axios.ts (interceptors), utils.ts
│       └── types/                # Shared TypeScript interfaces
│
└── backend/                      # Express.js API
    ├── prisma/
    │   └── schema.prisma         # WeatherRecord model + indexes
    └── src/
        ├── app.ts                # Express app (no listen — testable)
        ├── index.ts              # Server entry point (calls listen)
        ├── __tests__/            # Jest + Supertest test suites (32 tests)
        ├── config/               # database.ts (Prisma singleton)
        ├── controllers/          # weatherController, recordController, exportController
        ├── routes/               # weatherRoutes, recordRoutes, exportRoutes
        └── services/             # weatherService, geocodingService,
                                  # youtubeService, exportService
```

---

## Database Schema

```sql
-- weather_records (Supabase PostgreSQL)
CREATE TABLE weather_records (
  id             TEXT PRIMARY KEY,           -- cuid()
  location       TEXT NOT NULL,
  latitude       DOUBLE PRECISION NOT NULL,
  longitude      DOUBLE PRECISION NOT NULL,
  start_date     TIMESTAMPTZ NOT NULL,
  end_date       TIMESTAMPTZ NOT NULL,
  temperature    DOUBLE PRECISION NOT NULL,
  feels_like     DOUBLE PRECISION,
  humidity       DOUBLE PRECISION NOT NULL,
  wind_speed     DOUBLE PRECISION,
  pressure       DOUBLE PRECISION,
  visibility     DOUBLE PRECISION,
  cloud_coverage DOUBLE PRECISION,
  sunrise        INTEGER,
  sunset         INTEGER,
  timezone       INTEGER,
  condition      TEXT NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ
);

-- Indexes
CREATE INDEX ON weather_records (location);
CREATE INDEX ON weather_records (created_at);
CREATE INDEX ON weather_records (start_date);
CREATE INDEX ON weather_records (temperature);
```

---

## REST API Reference

### Weather

| Method | Endpoint | Query params | Description |
|---|---|---|---|
| GET | `/api/weather/search` | `query` | Weather by city / zip / landmark |
| GET | `/api/weather/coordinates` | `lat`, `lon` | Weather by GPS coordinates |
| GET | `/api/weather/forecast` | `query` | 5-day forecast |
| GET | `/api/weather/suggestions` | `query` | Location autocomplete (min 2 chars) |
| GET | `/api/youtube/videos` | `location`, `maxResults` | Travel videos |

**Rate limit:** 30 requests / minute per IP

### Records (CRUD)

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/api/records` | — | List records (paginated) |
| POST | `/api/records` | `{ location, startDate, endDate, notes? }` | Create record |
| GET | `/api/records/:id` | — | Get single record |
| PATCH | `/api/records/:id` | `{ location?, startDate?, endDate?, notes? }` | Update record |
| DELETE | `/api/records/:id` | — | Delete one record |
| DELETE | `/api/records` | `{ ids: string[] }` | Bulk delete |
| DELETE | `/api/records/all` | — | Delete all records |

**GET /api/records query params:** `page`, `limit`, `search`, `sortBy` (`createdAt` · `location` · `temperature` · `startDate`), `sortOrder` (`asc` · `desc`)

### Export

| Method | Endpoint | Response |
|---|---|---|
| GET | `/api/export/json` | `application/json` — download |
| GET | `/api/export/csv` | `text/csv` — download |
| GET | `/api/export/markdown` | `text/markdown` — download |
| GET | `/api/export/pdf-data` | JSON array for client-side PDF |

**Rate limit:** 10 requests / minute per IP

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API status + version |

---

## Setup

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (or a [Supabase](https://supabase.com) project)
- OpenWeatherMap API key — [openweathermap.org](https://openweathermap.org/api) (free tier)
- YouTube Data API v3 key — [Google Cloud Console](https://console.cloud.google.com)

### 1. Clone and install

```bash
git clone https://github.com/lberniilyas/weather.git
cd weather/weather-app

cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment variables

**Backend** — create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
OPENWEATHER_API_KEY=your_key_here
YOUTUBE_API_KEY=your_key_here
CORS_ORIGIN=http://localhost:3000
API_KEY=your_chosen_secret_here
```

> If using Supabase: use the **Transaction pooler** URL (port 6543) for `DATABASE_URL` and the **Direct** URL (port 5432) for `DIRECT_URL`.
> `API_KEY` is a secret you choose — it guards all record write/delete endpoints. Must match `NEXT_PUBLIC_API_KEY` in the frontend.

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_KEY=your_chosen_secret_here
```

### 3. Database

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Start

```bash
# Terminal 1 — backend
cd backend && npm run dev
# → http://localhost:5000

# Terminal 2 — frontend
cd frontend && npm run dev
# → http://localhost:3000
```

---

## Tests

```bash
cd backend
npm test              # run all 32 tests
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

**Test coverage:**

| Suite | Tests | What's covered |
|---|---|---|
| `health.test.ts` | 2 | Health endpoint, 404 handler |
| `weather.test.ts` | 10 | Search, coordinates, forecast, suggestions — valid & invalid inputs |
| `records.test.ts` | 14 | Full CRUD — create, read, update, delete, bulk delete, pagination |
| `export.test.ts` | 6 | JSON / CSV / Markdown / PDF-data exports — headers and body content |

All external dependencies (Prisma, OpenWeatherMap, Nominatim, YouTube) are mocked — tests run fully offline.

---

## Security

- **Helmet.js** — sets 11 security response headers on every request
- **CORS** — restricted to `CORS_ORIGIN` env variable
- **Rate limiting** — global cap (200/15 min) + per-route caps on weather and export routes
- **Request size limit** — `express.json({ limit: '50kb' })` prevents body-size DoS
- **XSS prevention** — location strings HTML-escaped before injection into Leaflet popups
- **No secrets in client bundle** — all API keys are backend-only; `NEXT_PUBLIC_API_URL` is the only frontend env variable
- **`.env` never committed** — gitignored at both root and package level
- **`npm audit`** — 0 backend vulnerabilities, 2 moderate frontend (PostCSS via Next.js internals, no fix available without downgrading Next)

---

## Project Structure Notes

- `backend/src/app.ts` is the Express app without `listen()` — imported by both `index.ts` (production) and test files (Supertest), keeping tests free from port conflicts
- Leaflet is loaded with `ssr: false` dynamic import — prevents Next.js server-side rendering crash
- PDF generation is fully client-side (jsPDF v4) — no server-side PDF dependency, no memory spike under load
- PgBouncer transaction pooler (port 6543) is used for all runtime DB connections; the direct URL (port 5432) is used only for Prisma migrations via `directUrl`

---

*Built by **Ilyas Lberni***
