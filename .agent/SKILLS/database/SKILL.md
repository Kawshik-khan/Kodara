---
name: database
version: 1.0.0
description: Design, migrate, and optimize relational schemas, indexes, and queries in PostgreSQL.
requires:
  - project-context
  - architecture
---

# Purpose
The `database` skill governs PostgreSQL schema modeling, migrations, foreign key integrity, index optimization, and transaction boundaries across Kodara's relational data layer.

# When to use
- When creating or updating database tables, columns, or relations.
- When writing migration scripts or database seeders.
- When optimizing slow queries, adding indexes, or designing data retention policies.

# What not to use it for
- Managing ephemeral client UI state or cache layers (use Redis or TanStack Query).
- Designing visual UI components.

# Required context
- [.agent/ARCHITECTURE.md](file:///f:/OLama/Kodara/.agent/ARCHITECTURE.md)

# Inputs
- Schema change proposal, query optimization requirement, or entity relationship model.

# Procedure
1. **Migration-Only Schema Changes**: Never modify schemas directly or manually. Always create an explicit, timestamped migration script.
2. **Relational Integrity**:
   - Define explicit foreign keys with appropriate `ON DELETE` behavior (`CASCADE` for child collections, `RESTRICT` for critical parent references).
   - Use `NOT NULL` constraints with defaults where appropriate.
3. **Indexing Strategy**:
   - Add B-Tree indexes to all foreign key columns and frequent lookup keys (`user_id`, `track_id`, `slug`).
   - Use composite indexes for frequent compound queries (e.g., `(user_id, concept_id)` in `concept_mastery`).
4. **Transaction Boundaries**: Wrap multi-table state transitions (e.g., submitting a challenge, updating mastery, and logging evidence) inside atomic database transactions (`BEGIN ... COMMIT`).
5. **Soft vs. Hard Deletes**: Use soft deletes (`deleted_at`) for user accounts and curriculum records; use hard deletes for ephemeral session tokens.

# Rules
- Never store plaintext secrets, passwords, or API tokens in the database.
- Migrations must be bidirectional (implementing both `up` and `down` methods).
- Schema changes must be backward-compatible with running API services during deployments.

# Validation
- Migrations execute forward and backward cleanly without data loss or locking locks.
- Query plans (`EXPLAIN ANALYZE`) verify proper index scans on high-traffic endpoints.

# Outputs
- Versioned migration files, schema definitions, and repository query tests.

# Failure handling
- If a migration fails in testing, roll back immediately and inspect schema locks or missing constraint dependencies.
