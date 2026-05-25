# AssignAI — AI Assessment Creator (MVP)

AI-powered platform for educators to create structured assessment question papers with real-time generation status and PDF export.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Zustand, Socket.IO client |
| **Backend** | Express, TypeScript, MongoDB (Mongoose), Redis, BullMQ, Socket.IO |
| **AI** | Groq API — `llama-3.3-70b-versatile` (OpenAI-compatible SDK) |
| **PDF** | Puppeteer (HTML → PDF) |

##Demo 
<img width="1912" height="877" alt="image" src="https://github.com/user-attachments/assets/409acd32-0580-4104-9ace-be3c3bc62a9e" />
<img width="1897" height="862" alt="image" src="https://github.com/user-attachments/assets/305575dc-dd3c-4be7-9e8c-340140f53bce" />
<img width="1910" height="876" alt="image" src="https://github.com/user-attachments/assets/0c9b3006-52d6-4025-8d55-18c3762d119d" />



## Architecture Overview

```mermaid
flowchart TB
  subgraph client [Frontend - Next.js]
    UI[Dashboard / Create / Paper View]
    Store[Zustand Store]
    SocketC[Socket.IO Client]
    UI --> Store
    UI --> SocketC
  end

  subgraph api [Backend API Process]
    REST[Express REST]
    SIO[Socket.IO Server]
    Bridge[Redis Event Bridge]
    REST --> Mongo[(MongoDB)]
    Bridge --> SIO
    SocketC <-->|WebSocket| SIO
    UI -->|HTTP| REST
  end

  subgraph worker [Worker Process]
    BullW[BullMQ Worker]
    Gen[Generation Service]
    Groq[Groq API]
    BullW --> Gen
    Gen --> Groq
    Gen --> Mongo
    Gen -->|publish| Redis[(Redis)]
  end

  REST -->|enqueue job| Redis
  Redis --> BullW
  Redis -->|subscribe| Bridge
```

### Request flow (generation)

1. User submits the assignment form → `POST /api/assignments`.
2. API saves the assignment (`queued`) and enqueues a BullMQ job on Redis.
3. Worker picks up the job, sets status `generating`, calls Groq with a structured JSON prompt.
4. Response is parsed and validated (Zod); up to 3 attempts on parse failure.
5. Valid paper is saved (`completed`); events are published on Redis.
6. API process receives the event via the Redis bridge and emits Socket.IO updates to the client.
7. Frontend also polls while `queued`/`generating` as a fallback.

## Approach

- **Separation of concerns:** REST for CRUD, BullMQ worker for long-running AI work, Socket.IO for live UI updates.
- **Worker ↔ API bridge:** The worker runs without Socket.IO; assignment events are published over Redis and relayed by the API server so clients still get real-time updates.
- **Structured AI output:** System prompt enforces JSON; Groq’s shape is normalized to a canonical `QuestionPaper` schema (sections, question types, marks, difficulty).
- **Resilience:** Parse retries with error feedback to the model; failed jobs surface `failed` status with retry endpoint.
- **Shared types:** `shared/types/` is the source of truth for backend; `frontend/src/types/` mirrors the same contracts.

## Prerequisites

- **Node.js** 20+
- **Groq API key** — [console.groq.com](https://console.groq.com/)
- **MongoDB** and **Redis** — either:
  - **Docker** (local), or
  - **Cloud** (MongoDB Atlas + Upstash Redis) — no Docker required

## Setup

### Option A — Docker (local Mongo + Redis)

```bash
# 1. Infrastructure
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
# Set GROQ_API_KEY in .env

npm install
npm run dev        # Terminal 1 — API + Socket.IO → http://localhost:4000
npm run worker     # Terminal 2 — required for AI generation

# 3. Frontend
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev        # Terminal 3 → http://localhost:3000
```

### Option B — Without Docker (cloud Mongo + Redis)

1. **MongoDB Atlas** — free M0 cluster, connection string with database `assignai`, IP allowlist for your machine.
2. **Upstash Redis** — copy the Redis URL (`rediss://...`).
3. **`backend/.env`:**

```env
PORT=<your_port>
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/assignai?retryWrites=true&w=majority
REDIS_URL=rediss://default:TOKEN@your-instance.upstash.io:6379
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
CORS_ORIGIN=http://localhost:3000
```

4. Run the three terminals as in Option A (steps 2–3).

**Health check:** `GET http://localhost:4000/api/health`

## Project Structure

```
AssignAI/
├── frontend/                 # Next.js app (dashboard, create, paper view)
│   └── src/
│       ├── app/              # App Router pages
│       ├── components/       # UI, forms, paper layout
│       ├── hooks/            # API + Socket.IO + polling
│       ├── store/            # Zustand assignment state
│       └── types/            # Mirrors shared/types
├── backend/
│   └── src/
│       ├── ai/               # Prompts, parser, Zod schemas
│       ├── controllers/      # REST handlers
│       ├── queues/           # BullMQ queue + worker
│       ├── services/         # AI, generation, PDF, assignments
│       └── socket/           # Socket.IO + Redis event bridge
├── shared/types/             # Shared TypeScript contracts
└── docker-compose.yml        # MongoDB 7 + Redis 7
```

## Features

- Assignment dashboard (list, search, status filter, empty state)
- Multi-step assignment creation form
- AI question paper generation (Groq → validated JSON)
- Real-time status (`queued` → `generating` → `completed` / `failed`)
- Structured paper view (sections, MCQ / short / long, marks, difficulty)
- **PDF export** — download from paper view or `GET /api/assignments/:id/pdf`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/assignments` | Create assignment and enqueue generation |
| `GET` | `/api/assignments` | List assignments |
| `GET` | `/api/assignments/:id` | Get assignment by ID |
| `GET` | `/api/assignments/:id/pdf` | Download question paper as PDF |
| `POST` | `/api/assignments/:id/retry` | Retry failed generation |

## Environment Variables

| File | Variables |
|------|-----------|
| `backend/.env.example` | `PORT`, `MONGODB_URI`, `REDIS_URL`, `GROQ_API_KEY`, `GROQ_MODEL`, `CORS_ORIGIN` |
| `frontend/.env.local.example` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL` |

Never commit `.env` or `.env.local` with real secrets.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `MongoServerSelectionError` | Check Atlas URI, credentials, IP whitelist |
| Redis connection errors | Verify `REDIS_URL` (Upstash or `redis://localhost:6379`) |
| Jobs stay `queued` | Start `npm run worker` in a second terminal |
| UI stuck on “generating” | Ensure API **and** worker are running; refresh page (polling + socket) |
| CORS errors | Set `CORS_ORIGIN=http://localhost:3000` |
| PDF fails locally | Puppeteer needs Chromium; run `npm install` in `backend` |

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| `backend/` | `npm run dev` | API + Socket.IO |
| `backend/` | `npm run worker` | BullMQ AI worker |
| `backend/` | `npm run build` | Compile TypeScript |
| `frontend/` | `npm run dev` | Next.js dev server |
| `frontend/` | `npm run build` | Production build |

## License

Private MVP — hiring assessment submission.
