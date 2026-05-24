---
name: 2026-03-26 session
description: Codebase review, 7-layer hardening, production pipeline fixes, 8-agent fleet, schedule restructure
type: project
---

## Session Summary (2026-03-24 to 2026-03-26)

### Codebase Review & Fixes
- 8 bug/robustness fixes: empty rows guard, median calc, gate logging, KeyError guard, dry-run fallback, Spearman ties, options overlay logging, JSONL logging
- 3 staleness warnings: PIT cache, financial records, price history
- Schema contracts synced with production data
- WSL2 snapshot promotion fallback (copy+delete when rename fails)
- Delisted tickers excluded from price refresh (11 fewer ERROR lines)
- 45-minute timeout on production cron wrapper

### Test Coverage
- 112 new tests: edge cases, 3 untested tools, shadow portfolio reflow, provenance ladder, contract determinism

### 7-Layer DEM Hardening (all shipped)
1. Receipt completeness gate — blocks promotion without health-monitor baseline
2. Policy-FAIL-but-complete-packet — exit 1 continues downstream if rankings.csv exists
3. Readiness gate: catalyst concentration check, position budget, two-key gate
4. Provenance ladder: hard-source priority in nearest-event lookup + 37 tie-break tests
5. Ops digest: root-cause codes, new/carried-over flags, receipt provenance, decision diff
6. Idempotent reruns + step markers + agent heartbeat from cron
7. Contract determinism: property fuzz, snapshot diff budget, ruleset migration tests

### Production Pipeline
- Schedule moved: production 4:30 PM ET, agents 5:00-5:30 PM ET
- Runner continues on Phase-2 policy FAIL (catalyst concentration)
- Hard-catalyst priority fix (prevents soft CTGov PCD from masking SEC PDUFA)
- BIIB PDUFA confirmed May 24 (not April 3 as originally noted)
- Ops digest NoneType crash fixed

### 8-Agent Fleet (all live)
- Core monitors: ops (5:00), sentinel (5:15), qa (5:30) — cron
- Governance: calibration (Fri 6:00) — cron
- Alpha overlays: catalyst_delta, options_watch (Phase 2 spec), postmortem — manual
- Decision surface: review_queue_steward — manual, read-only

### Current Operating Directive
- STOP adding agents. Prove the 8-agent model first.
- Run catalyst_delta 5-day trial → promote to cron if passes
- Use review_queue_steward manually for a week
- options_watch Phase 2 only after catalyst_delta graduates
- postmortem dormant until April cluster resolves (~April 1-3)
