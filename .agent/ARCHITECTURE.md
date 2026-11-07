# KODARA SYSTEM ARCHITECTURE

## 1. High-Level System Architecture

Kodara follows a **Modular Monolith** pattern for core web services, paired with **Asynchronous Isolated Execution Workers** for untrusted code execution and AST tracing.

```text
                         KODARA WEB (Browser)
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
  Learning Engine           Playground UI             AI Tutor UI
         │                        │                        │
         │                        ▼                        │
         │                 Execution API                   │
         │                        │                        │
         │                        ▼                        │
         │                  Redis Queue                    │
         │                        │                        │
         │                        ▼                        │
         │                 Execution Worker                │
         │                        │                        │
         │                        ▼                        │
         │                 Isolated Sandbox                │
         │                 (Docker / gVisor)               │
         │                        │                        │
         │                        ▼                        │
         │                  Trace Protocol                 │
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  ▼
                        Visualization Engine
                                  │
                                  ▼
                            Mastery Engine
                                  │
                                  ▼
                         PostgreSQL Database
```

## 2. Architectural Boundaries & Components

### 2.1. Frontend Application (`web`)
- **Technology Stack**: React 18+ / TypeScript / Vite.
- **Styling**: Vanilla CSS / CSS Modules with canonical White + Orange + Technical Grid design system. No Tailwind unless explicitly decided via ADR.
- **Server State Management**: TanStack Query (v5) handles caching, polling, deduplication, and synchronization with backend APIs.
- **Local Client State**: Zustand stores strictly dedicated to ephemeral UI states (e.g., active editor panels, visualization playback speed, layout sizing).
- **Core Interactive Libraries**:
  - Code Editing: Monaco Editor (lazy-loaded).
  - Graph Visualization: React Flow (for System Design Lab).
  - Trace Visualizer: Custom SVG/Canvas step-driven state machine.

### 2.2. Backend API (`api`)
- **Pattern**: Modular Monolith organized by domain services.
- **Framework**: Node.js (Fastify/Express with TypeScript) or Python (FastAPI).
- **Layers**:
  ```text
  Route Handler / Controller
          ↓
     Domain Service
          ↓
  Repository / Data Access
          ↓
     PostgreSQL DB
  ```
- **Responsibilities**:
  - Authentication, sessions, and authorization.
  - Curriculum hierarchy delivery and concept prerequisite resolution.
  - Mastery calculation and review queue generation.
  - Job submission to the asynchronous execution queue.
  - AI Tutor context aggregation and streaming proxy.

### 2.3. Asynchronous Code Execution Pipeline (`worker` + `sandbox`)
Never execute untrusted user code inside the API process.

```text
Client Code Submission
         ↓ (HTTP POST)
   Execution API
         ↓ (Push Job)
    Redis Queue
         ↓ (Pop Job)
  Execution Worker
         ↓ (Spawn ephemeral container)
  Isolated Sandbox
  - Non-root user
  - Read-only root filesystem with ephemeral tmpfs
  - Network disabled (--net=none)
  - Strict cgroups: CPU (1 core max), RAM (256MB max), Timeout (5s max)
         ↓
  Language Trace Adapter (Node / Python AST / Instrumenter)
         ↓
  Normalized Trace Protocol JSON
         ↓ (WebSocket / SSE / Redis pubsub)
   Browser Client
```

### 2.4. Common Language-Agnostic Trace Protocol
Both client-side simulated traces and worker-generated execution traces conform to a unified schema:

```ts
interface ExecutionTrace {
  version: string;
  language: "typescript" | "javascript" | "python";
  sourceCode: string;
  events: TraceEvent[];
  summary: TraceSummary;
}

type TraceEvent =
  | VariableAllocationEvent
  | VariableMutationEvent
  | FunctionCallEvent
  | FunctionReturnEvent
  | ScopeEnterEvent
  | ScopeExitEvent
  | HeapObjectCreateEvent
  | HeapReferenceEvent
  | PromiseStateChangeEvent
  | EventLoopTurnEvent
  | ExceptionThrownEvent;
```

### 2.5. Storage Architecture (`db`)
PostgreSQL serves as the single source of truth for:
- User accounts and authentication credentials.
- Curriculum content indices and concept prerequisite DAGs.
- Interactive exercise definitions and test suites.
- Granular learner evidence logs (attempts, hints, execution outcomes).
- Concept mastery vectors and review schedules.

Redis serves as:
- Message broker for execution jobs.
- Cache for high-frequency curriculum queries.
- Pub/Sub channel for live execution trace streaming.
- Rate limiting store.

## 3. Frontend Architecture (Feature Slicing)

The frontend source structure follows domain-driven feature modules:

```text
src/
├── app/                  # Application root, router, global providers
├── assets/               # Static assets, brand SVGs, grid patterns
├── components/           # Shared primitive UI components (Button, Card, Input, Modal)
├── config/               # Environment constants, routes config
├── hooks/                # Shared utility hooks (useDebounce, useMediaQuery)
├── i18n/                 # Centralized internationalization system
│   ├── index.ts          # Localization provider & useTranslation hook
│   ├── config.ts         # Supported locales ('bn', 'en'), default 'bn'
│   └── locales/          # Semantic translation dictionaries
│       ├── bn/           # Bangla locale modules (common, lessons, errors, etc.)
│       └── en/           # English locale modules
├── lib/                  # Core utility functions, formatters, HTTP client
├── styles/               # Design tokens, global CSS variables, grid definitions
├── types/                # Shared global TypeScript types
└── features/             # Domain feature modules
    ├── auth/             # Login, register, session management
    ├── dashboard/        # Learner overview, resume learning, stats bento
    ├── learning/         # Track overview, module browser, prerequisite map
    ├── lessons/          # 16-step lesson runner, section orchestrator
    ├── playground/       # Standalone coding playground
    ├── execution/        # Execution runner, terminal output, trace dispatcher
    ├── visualization/    # Step visualizer, memory inspector, call-stack viewer
    ├── challenges/       # Challenge runner, code fixers, visual quizzes
    ├── projects/         # Multi-file project workspace
    ├── concepts/         # Concept detail page, prerequisite explorer
    ├── skill-map/        # Interactive interactive knowledge graph
    ├── architecture-lab/ # React Flow distributed system designer & simulator
    ├── ai-tutor/         # Socratic tutor dialog, hint escalation widget
    └── progress/         # Detailed mastery breakdown, spaced review queue
```

## 4. Architectural Invariants

1. **Decoupled Visualization**: The visualization engine never relies directly on raw source code strings. It consumes normalized `TraceEvent` or `VisualizationStep` state sequences.
2. **Server State Integrity**: Never copy TanStack Query cache data into Zustand stores. Local stores hold only UI toggles and interaction states.
3. **No Direct Secret Access**: The browser client never holds AI API keys or backend admin keys. All external services are proxied through authenticated backend routes.
4. **Resilient Offline / Demo Mode**: Educational visualizations must support offline pre-rendered steps for reference lessons when execution workers are unreachable.
5. **Language-Neutral Domain Layer**: Database models, API schemas, and business entities use canonical English identifiers (e.g., `status: "completed"`, `difficulty: "beginner"`). Localization belongs strictly to the presentation layer (`src/i18n/`).
6. **Native Bangla as Default Product Language**: The application initializes in Bangla (`bn`) by default, backed by the `Noto Sans Bengali` font stack with horizontal text expansion accommodations.
7. **Non-Destructive Language Switching**: Toggling between `বাংলা` and `English` must preserve current lesson step, code editor buffers, execution traces, and challenge attempts without reset.
