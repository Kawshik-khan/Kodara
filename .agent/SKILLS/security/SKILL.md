---
name: security
version: 1.0.0
description: Audit, enforce, and harden security boundaries across code execution sandboxes, AI tools, and web APIs.
requires:
  - project-context
  - architecture
---

# Purpose
The `security` skill ensures that Kodara remains hardened against remote code execution escapes, denial of service, prompt injection, data leakage, and cross-site scripting vulnerabilities.

# When to use
- Before implementing or approving changes to code execution workers or sandbox profiles.
- When introducing or modifying AI prompt templates, tool definitions, or user input ingestion.
- When modifying authentication, session handling, CORS, or Content Security Policies (CSP).

# What not to use it for
- General layout styling or color token adjustments.
- Educational curriculum writing.

# Required context
- [.agent/SECURITY.md](file:///f:/OLama/Kodara/.agent/SECURITY.md)
- [.agent/EXECUTION-SPEC.md](file:///f:/OLama/Kodara/.agent/EXECUTION-SPEC.md)

# Inputs
- Security-sensitive feature proposal, pull request diff, or vulnerability audit report.

# Procedure
1. **Sandbox Boundary Audit**:
   - Verify non-root user execution (`uid=10001`).
   - Confirm `--net=none` is permanently enabled on worker execution containers.
   - Confirm strict cgroups limits: CPU = 1 core, RAM = 256MB, Timeout = 5 seconds, max 32 PIDs.
   - Ensure `/var/run/docker.sock` is never accessible.
2. **AI & Prompt Injection Audit**:
   - Ensure system instructions are isolated with explicit XML tags.
   - Confirm user messages and code inputs are sanitized and length-capped.
   - Confirm API keys are stored exclusively in secure server environment variables.
3. **Web & XSS Audit**:
   - Ensure all rendered markdown and code outputs pass through DOMPurify.
   - Confirm CSP headers block `unsafe-eval` and unauthorized script domains.
   - Verify authentication cookies use `HttpOnly`, `Secure`, and `SameSite=Strict`.
4. **Rate Limiting Verification**:
   - Verify Redis-backed rate limits protect execution endpoints and AI chat routes from automated abuse.

# Rules
- Never bypass sandbox isolation for convenience or debugging.
- Never commit secrets, API keys, or private certificates to version control.
- Security rules supersede all general development velocity preferences.

# Validation
- Automated security integration tests pass (infinite loop timeout, memory exhaustion, network disablement).
- Vulnerability scanners (e.g., `pnpm audit`) report zero critical or high vulnerabilities.

# Outputs
- Security audit sign-offs, hardened container configurations, and vulnerability mitigations.

# Failure handling
- If any sandbox escape or credential exposure is discovered, immediately file a critical blocker in `.agent/STATE/BLOCKERS.md` and halt affected execution routes.
