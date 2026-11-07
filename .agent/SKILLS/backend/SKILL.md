---
name: backend
version: 1.0.0
description: Build modular, secure, and type-safe backend services, API endpoints, and worker integrations.
requires:
  - project-context
  - architecture
  - security
---

# Purpose
The `backend` skill guides the construction of modular backend services within the Kodara modular monolith. It enforces clean layering (Routes → Services → Repositories → Database), input validation, rate limiting, and secure background job dispatching.

# When to use
- When building or modifying backend API endpoints.
- When creating domain services (e.g., CurriculumService, MasteryService, ExecutionService).
- When integrating with Redis queues, background worker jobs, or AI streaming proxies.

# What not to use it for
- Building React components or managing frontend browser state.
- Writing raw educational Markdown content.

# Required context
- [.agent/ARCHITECTURE.md](file:///f:/OLama/Kodara/.agent/ARCHITECTURE.md)
- [.agent/SECURITY.md](file:///f:/OLama/Kodara/.agent/SECURITY.md)

# Inputs
- API endpoint specification, service interface, or worker task requirement.

# Procedure
1. **Layered Structure**: Follow strict layering for all features:
   ```text
   Route Controller (Validates inputs via Zod, handles HTTP response codes)
           ↓
   Domain Service   (Encapsulates business rules, transactions, orchestrations)
           ↓
   Repository Layer (Performs parameterized database queries and data mapping)
   ```
2. **Input Validation**: Validate every request body, query parameter, and route parameter using strict schemas (e.g., Zod).
3. **Queue Job Dispatching**: For code execution or heavy compute, push jobs to Redis queue (BullMQ). Never block HTTP requests waiting on sandboxes.
4. **Error Handling**: Use structured error classes (`NotFoundError`, `ValidationError`, `UnauthorizedError`) caught by a global error handler returning standardized JSON errors (`{ error: { code, message } }`).
5. **Logging & Tracing**: Log all system errors and execution job lifecycle events with correlation IDs. Never log sensitive credentials or private tokens.

# Rules
- Never place business or domain logic directly inside route controllers.
- Never execute untrusted learner code within the backend web process.
- All database queries must use parameterized statements to prevent SQL injection.

# Validation
- Integration tests verify endpoint status codes, validation error responses, and database transactions.

# Outputs
- Type-safe route handlers, services, and integration test suites.

# Failure handling
- If an asynchronous job fails or times out, ensure the job state is updated cleanly in Redis/PostgreSQL with descriptive error reasons.
