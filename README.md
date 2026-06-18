# WeatherPro — PM Accelerator Technical Assessment

> **Built by Ilyas Lberni** · Full-Stack AI Engineer Internship Assessment

---

## Assessment Status

| Assessment | Status | Description |
|---|---|---|
| ✅ Tech Assessment #1 | **Completed** | Frontend — Next.js 15, React, TypeScript, TailwindCSS |
| ✅ Tech Assessment #2 | **Completed** | Backend — Express.js, Node.js, TypeScript, PostgreSQL, Prisma |

---

## Project Overview

WeatherPro is a production-ready full-stack weather application that satisfies both frontend and backend technical assessments. It features real-time weather search, a 5-day forecast, complete CRUD operations backed by PostgreSQL, an interactive Leaflet map, YouTube travel video integration, four export formats, and an AI-powered weather assistant.

---

## Features

| # | Feature | Tech |
|---|---|---|
| 1 | Search by city, country, zip, GPS coords, landmark | OpenWeatherMap API + Nominatim |
| 2 | Use My Current Location (browser GPS) | Geolocation API |
| 3 | 5-Day Forecast (responsive grid) | OpenWeatherMap Forecast API |
| 4 | Detailed weather metrics | OpenWeatherMap |
| 5 | Full CRUD — create, read, update, delete records | PostgreSQL + Prisma |
| 6 | Date range validation | Zod |
| 7 | Location validation with fuzzy matching | OpenStreetMap Nominatim |
| 8 | YouTube travel/tourism video integration | YouTube Data API v3 |
| 9 | Interactive map with marker | Leaflet + OpenStreetMap |
| 10 | Export: JSON · CSV · Markdown · PDF | Node.js |
| 11 | AI Weather Assistant (clothing/travel/activity tips) | Rule-based + weather data |
| 12 | Responsive design (mobile-first) | TailwindCSS Grid/Flex |
| 13 | Loading skeletons & spinners | TailwindCSS |
| 14 | Accessibility (ARIA, keyboard nav) | Semantic HTML |
| 15 | Error handling everywhere | Zod + error boundaries |

---

## Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| Next.js | 15 | App framework (App Router) |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| TailwindCSS | 3 | Styling |
| Axios | 1 | HTTP client |
| React Hook Form | 7 | Forms |
| Zod | 3 | Validation |
| Leaflet + react-leaflet | 1 / 4 | Map |
| jsPDF + autotable | 2 / 3 | PDF export |
| PapaParse | 5 | CSV export |
| lucide-react | — | Icons |
| date-fns | 4 | Date utilities |

### Backend
| Package | Version | Purpose |
|---|---|---|
| Express.js | 4 | HTTP server |
| Node.js | 20 | Runtime |
| TypeScript | 5 | Type safety |
| PostgreSQL | 16 | Database |
| Prisma ORM | 5 | Database access |
| Zod | 3 | Validation |
| Axios | 1 | External API calls |
| Helmet | 8 | Security headers |
| Morgan | 1 | Request logging |
| CORS | 2 | Cross-origin |

---

## Architecture

```
weather-app/
├── frontend/                   # Next.js 15 App
│   └── src/
│       ├── app/                # Routes (App Router)
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/
│       │   ├── ui/             # Button, Card, Modal, Input, Loading
│       │   ├── weather/        # SearchBar, WeatherCard, ForecastCard, WeatherDetails, AIAssistant
│       │   ├── crud/           # RecordForm, RecordList, RecordTable
│       │   ├── map/            # WeatherMap (Leaflet)
│       │   ├── youtube/        # VideoGrid
│       │   ├── export/         # ExportButtons
│       │   └── layout/         # Header, Footer
│       ├── hooks/              # useWeather, useGeolocation, useRecords
│       ├── services/           # weatherApi, recordApi, exportApi
│       ├── lib/                # axios.ts, utils.ts
│       ├── types/              # Shared TypeScript interfaces
│       └── validations/        # Zod schemas (client-side)
│
└── backend/                    # Express.js API
    ├── prisma/
    │   └── schema.prisma       # WeatherRecord model
    └── src/
        ├── index.ts            # Server entry point
        ├── config/             # database.ts, env.ts
        ├── controllers/        # weatherController, recordController, exportController
        ├── routes/             # weatherRoutes, recordRoutes, exportRoutes
        ├── services/           # weatherService, geocodingService, youtubeService, exportService
        ├── middleware/         # errorHandler, validation
        ├── types/              # Shared interfaces
        └── validations/        # Zod schemas (server-side)
```

---

## Database Schema

```sql
-- Table: weather_records
CREATE TABLE weather_records (
  id          TEXT PRIMARY KEY,         -- cuid
  location    TEXT NOT NULL,
  latitude    DOUBLE PRECISION NOT NULL,
  longitude   DOUBLE PRECISION NOT NULL,
  start_date  TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ NOT NULL,
  temperature DOUBLE PRECISION NOT NULL,
  humidity    DOUBLE PRECISION NOT NULL,
  condition   TEXT NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ
);
```

---

## REST API Documentation

### Weather

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/weather/search?query=Paris` | Search weather by any query type |
| GET | `/api/weather/coordinates?lat=48.8566&lon=2.3522` | Weather by GPS |
| GET | `/api/weather/forecast?query=Paris` | 5-day forecast |
| GET | `/api/weather/suggestions?query=Casablanka` | Fuzzy location suggestions |
| GET | `/api/youtube/videos?location=Paris` | YouTube travel videos |

### Records (CRUD)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/records?page=1&limit=10&search=&sortBy=createdAt&sortOrder=desc` | List with pagination |
| POST | `/api/records` | Create record |
| GET | `/api/records/:id` | Get single record |
| PATCH | `/api/records/:id` | Update record |
| DELETE | `/api/records/:id` | Delete one |
| DELETE | `/api/records` | Bulk delete `{ ids: [] }` |
| DELETE | `/api/records/all` | Delete all |

### Export

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/export/json` | Download JSON |
| GET | `/api/export/csv` | Download CSV |
| GET | `/api/export/markdown` | Download Markdown |
| GET | `/api/export/pdf` | Download PDF |

---

## Installation & Setup

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 15+

### 1. Clone & install

```bash
# Install backend dependencies
cd weather-app/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment variables

```bash
# Backend
cd weather-app/backend
cp .env.example .env
# Edit .env — fill in DATABASE_URL, OPENWEATHER_API_KEY, YOUTUBE_API_KEY

# Frontend
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local — fill in NEXT_PUBLIC_OPENWEATHER_API_KEY, NEXT_PUBLIC_YOUTUBE_API_KEY
```

### 3. Database setup

```bash
cd weather-app/backend
npx prisma generate
npx prisma db push
```

### 4. Run backend

```bash
cd weather-app/backend
npm run dev
# → http://localhost:5000
```

### 5. Run frontend

```bash
cd weather-app/frontend
npm run dev
# → http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENWEATHER_API_KEY` | From openweathermap.org |
| `YOUTUBE_API_KEY` | From Google Cloud Console |
| `CORS_ORIGIN` | Frontend URL (default: http://localhost:3000) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (default: http://localhost:5000) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap key |
| `NEXT_PUBLIC_YOUTUBE_API_KEY` | YouTube Data API key |

---

## PM Accelerator

**About PM Accelerator**

PM Accelerator helps aspiring professionals gain practical experience in product management, artificial intelligence, and technology through mentorship, internships, collaborative projects, and career acceleration programs.

---

*Created by **Ilyas Lberni** — PM Accelerator AI Engineer Internship Technical Assessment, 2025*
