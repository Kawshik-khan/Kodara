# KODARA SECURITY SPECIFICATION

## 1. Threat Model Overview

Kodara accepts arbitrary source code from untrusted learners and prompts from learners to AI tutors. This introduces four primary attack surfaces:
1. **Remote Code Execution (RCE) on Host**: Malicious user code attempting to escape execution environments or compromise the server.
2. **Denial of Service (DoS)**: Infinite loops, fork bombs, or memory-exhaustion exploits designed to crash worker nodes.
3. **AI Injection & Data Exfiltration**: Prompt injection attempting to extract system prompts, API keys, or private assessment rubrics.
4. **Cross-Site Scripting (XSS) & Content Tampering**: Malicious payloads injected into lesson feedback, user submissions, or interactive rendered outputs.

## 2. Code Execution Sandbox Isolation

Untrusted user code must **never** be executed inside the web server or primary API process.

```text
Host Operating System
  └── Isolated Worker Daemon
        └── Ephemeral Non-Root Container / MicroVM
              ├── Read-Only Root Filesystem
              ├── Isolated tmpfs (/tmp max 32MB)
              ├── Network: Disabled (--net=none)
              └── cgroups Boundaries Enforced
```

### 2.1. Strict Sandbox Constraints
All execution jobs submitted to workers must strictly enforce these runtime limits:

- **User**: Non-root (`uid=10001`, `gid=10001`). No sudo, no setuid binaries.
- **Network**: Completely disabled (`--net=none`). User code cannot establish outbound TCP/UDP connections.
- **CPU**: Max 1 vCPU core pinned via cgroups (`--cpus=1.0`).
- **Memory**: Max 256MB RAM per execution (`--memory=256m`, `--memory-swap=256m`).
- **Wall Time Timeout**: 5 seconds hard timeout via worker supervisor SIGKILL.
- **Process Count (pids-limit)**: Max 32 simultaneous processes (`--pids-limit=32`) to block fork bombs.
- **Filesystem**: Root filesystem mounted strictly Read-Only (`--read-only`). Ephemeral scratch space limited to tmpfs with a 32MB ceiling.
- **Output Limit**: Max 64KB stdout/stderr buffer to prevent memory exhaustion from infinite print loops.
- **Docker Socket**: Never mount `/var/run/docker.sock` into worker or execution containers.

### 2.2. Client-Provided Constraints are Untrusted
Limits (timeout, memory, instructions) are determined strictly by the server's policy and challenge definition. The server completely ignores any client-supplied resource override parameters.

## 3. AI Tutor Security & Prompt Injection Defense

Learner chat messages and learner code are treated as **untrusted user input**.

```text
Untrusted Input (Code + Chat)
         ↓
  Sanitization & Length Bounds
         ↓
  TutorContextBuilder (Aggregates curriculum & AST metadata)
         ↓
  System Prompt Boundary & Delimiters
         ↓
  Model Inference (Streamed)
         ↓
  Output Sanitization (XSS filter / Code fence check)
         ↓
  Learner UI
```

### 3.1. Defensive Prompt Engineering
- System instructions are strictly delineated using strong XML delimiters (e.g. `<system_instructions>`, `<untrusted_student_code>`).
- Explicit instructions forbidding revealing internal prompts, scoring rubrics, or solution code in challenge mode.
- Context window truncation limits total conversation memory to prevent unbounded cost and context overflow attacks.

### 3.2. Secret Isolation
- The browser client never receives AI provider API keys.
- AI requests route through authenticated backend proxy endpoints (`/api/ai/tutor/message`).
- API keys reside strictly in secure backend environment variables, never committed to version control.

## 4. Web Security Standards

- **Cross-Site Scripting (XSS)**: All code output, Markdown documentation, and user submissions rendered in the DOM must be sanitized using DOMPurify. Raw `dangerouslySetInnerHTML` is prohibited unless wrapped in a validated sanitizer.
- **Content Security Policy (CSP)**: Strict CSP disallowing `unsafe-eval` in production bundles (using worker-based eval for playground sandboxes).
- **Authentication & Sessions**: Opaque session tokens (only their SHA-256 is stored) in a Secure, HTTP-only, `SameSite=Lax` cookie. `Lax` rather than `Strict`, so the Google OAuth redirect back into the SPA keeps the session. CSRF is blocked by an `Origin` allowlist plus a required `X-Kodara-Client` header on every state-changing request. No JWTs: revocation must be instant. Full rules: [API-SPEC.md §2.2](API-SPEC.md).
- **Rate Limiting**: Enforced on API execution submissions (max 10 executions/min per anonymous user, 60/min per authenticated user) via Redis sliding window counters.
