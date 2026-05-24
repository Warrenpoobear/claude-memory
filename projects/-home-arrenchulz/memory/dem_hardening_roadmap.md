---
name: DEM hardening roadmap
description: 7-layer hardening plan for the decision engine and production pipeline — prioritized by user 2026-03-26
type: project
---

## DEM Hardening Roadmap (user-specified, 2026-03-26)

Priority order:

1. **Receipt completeness + promotion canary**
   - No promotion without complete baseline receipt (all health-monitor fields)
   - Candidate must survive N shadow+readiness+drift runs before activation
   - Rollback rehearsal in CI against fake receipt/history

2. **Policy-FAIL-but-complete-packet semantics everywhere**
   - True failure = missing artifacts, schema break, unexpected exit
   - Policy failure = packet completes with FAIL/WARN sidecars, blocks trade execution
   - Cold-start/data-gap = advisory outputs, never pretend green
   - Highest-value hardening: prevents losing observability on bad days

3. **Stateful readiness/trade gate tightening**
   - Ruleset-specific readiness history (not just global)
   - Concentration override: block trades when hard-catalyst exposure too clustered
   - Position-change budget: modest churn + large trades → auto-downgrade
   - Two-key gate: readiness AND ruleset-health must both pass

4. **Formal provenance ladder + tie-break test suite**
   - hard > semi-hard > soft precedence (generalize the BIIB fix)
   - Tie-break tests for equal dates, equal distances, missing dates
   - Source-family change alerts (catalyst switches source without date movement)
   - Provenance confidence fields in snapshot

5. **Digest/root-cause instrumentation**
   - Root-cause code on every alert (not just prose)
   - New vs carried-over flags per issue
   - Active ruleset ID + prior ruleset + receipt provenance in every digest
   - Decision diff block: top entrants/exits, biggest rank/weight/source movers

6. **Agent/runtime catch-up and idempotency**
   - Idempotent reruns (same date → no duplicate side effects)
   - Per-step success markers
   - Rate-limit/backoff wrappers for agent heartbeats
   - Missed-run catch-up for agents (not just production)
   - Immutable input manifests for full output traceability

7. **Contract-level determinism** (extends existing suite)
   - Property/fuzz tests: catalyst fields, missing sponsors, drawdown modes, source tie-breaks
   - Snapshot diff budget test: same inputs+ruleset → narrow top-N overlap/rank shift band
   - Ruleset migration test: only intended fields change

**Why:** Progressively harder to silently regress, promote recklessly, lose observability, or trade on degraded outputs.

**How to apply:** Use this as the priority stack when choosing next hardening work. Items 1-2 are near-term (pre-April). Items 3-4 are post-April validation. Items 5-7 are ongoing.
