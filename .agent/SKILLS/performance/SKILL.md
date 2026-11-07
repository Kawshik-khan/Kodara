---
name: performance
version: 1.0.0
description: Optimize client-side render cycles, bundle sizes, lazy loading, and backend query efficiency.
requires:
  - project-context
  - frontend
---

# Purpose
The `performance` skill maintains Kodara's snappy, desktop-class responsiveness. It prevents bundle bloat, eliminates unnecessary React re-renders, ensures efficient query caching, and optimizes heavy components (Monaco Editor, React Flow).

# When to use
- When bundle size increases significantly or initial page load degrades.
- When interactive visualizers drop frames (<60fps) during step transitions.
- When optimizing database queries or API response times.

# What not to use it for
- Premature optimization: do NOT wrap every trivial component in `React.memo` or trivial value in `useMemo` without profiling evidence.
- Educational content authoring.

# Required context
- [.agent/ARCHITECTURE.md](file:///f:/OLama/Kodara/.agent/ARCHITECTURE.md)
- [.agent/DEVELOPMENT.md](file:///f:/OLama/Kodara/.agent/DEVELOPMENT.md)

# Inputs
- Performance profile, bundle analyzer output, slow query log, or user interaction latency report.

# Procedure
1. **Lazy Loading Heavy Subsystems**:
   - Verify Monaco Editor is lazy-loaded via dynamic `import()`.
   - Verify React Flow is lazy-loaded only on Architecture Lab routes.
   - Code-split routes so learners only download code for their active track.
2. **Eliminate Unnecessary Re-Renders**:
   - Profile React component trees using React Profiler.
   - Separate frequently mutating state (e.g., playback timeline progress) from static layout containers.
   - Colocate state close to the components that consume it.
3. **Query & Network Optimization**:
   - Leverage TanStack Query's stale-while-revalidate caching (`staleTime: 5 * 60 * 1000`).
   - Deduplicate concurrent requests for identical curriculum or user progress data.
   - Enable Gzip / Brotli compression and HTTP/2 multiplexing for static assets.
4. **Virtualization for Large Lists**:
   - Virtualize large lists of curriculum lessons or execution steps using `@tanstack/react-virtual` if items exceed 100 entries.

# Rules
- Do not apply premature micro-optimizations that damage code clarity unless supported by profiler measurements.
- Largest Contentful Paint (LCP) must remain < 1.5s on desktop broadband.
- Interaction to Next Paint (INP) must remain < 100ms.

# Validation
- Bundle analyzer reports main initial chunk < 250KB gzipped.
- Lighthouse performance score remains >= 90.

# Outputs
- Optimized components, code-split chunk definitions, and database query optimizations.

# Failure handling
- If heavy animation degrades low-end device performance, dynamically downgrade to static step snapshots without easing transitions.
