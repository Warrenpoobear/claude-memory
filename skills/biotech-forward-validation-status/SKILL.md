---
name: biotech-forward-validation-status
description: |
  Read-only status and triage for the DEM Top-30 forward-shadow mandate
  (SM-20260629-001). Use when the user says "forward validation status",
  "mandate status", "how many eligible windows", "is the capture feed alive",
  "why is no evidence accruing", or after any daily-production incident.
  Distinguishes evaluator health from investment evidence. Never registers,
  promotes, or modifies anything.
allowed-tools:
  - Bash(cat *)
  - Bash(ls *)
  - Bash(tail *)
  - Bash(grep *)
  - Bash(python3 *)
---

# Forward-Validation Status (SM-20260629-001)

## Purpose

Report mandate progress and diagnose why eligible LIVE evidence is or is not
accruing. Evaluator health ≠ investment evidence: a broken feed is an
infrastructure alert, NEVER negative-alpha evidence. Zero windows = zero
evidence, not zero alpha.

## When NOT to use

- Signal-health IC questions → `biotech-ic-check` (IC dashboard, a different evaluator).
- Anything that would change the candidate, thresholds, scopes, score fields,
  de-overlap rules, or cron: refuse and refer to the operator.
- Never re-register a candidate, edit CANDIDATE.json, or mark the mandate
  resolved — resolution is a human governance decision.

## Authoritative dependencies (read-only)

- `docs/model_documentation.md` § "Recent Updates — 2026-07-10" (canonical status)
- `docs/FORWARD_VALIDATION_PROTOCOL.md` (locked §2 test: 20 non-overlapping
  weekly 5d-excess-vs-XBI windows; one-tailed t ≥ 1.65 directional; |t| ≥ 1.96 confirmation)
- `artifacts/ic_council/shadows/SM-20260629-001.md` (mandate terms; backfill excluded)
- `artifacts/forward_validation/{CANDIDATE.json,captures.jsonl,fills.jsonl,LIVENESS_STATUS.json,WEEKLY_SUMMARY.md}`

## Preconditions

Repo readable at `/mnt/c/Projects/biotech_screener/biotech-screener`. If any
dependency file is missing, STOP and report which — do not reconstruct state.

## Workflow (all steps read-only)

### 1 — Candidate identity
```bash
cat /mnt/c/Projects/biotech_screener/biotech-screener/artifacts/forward_validation/CANDIDATE.json
```
Expect: `model_hash=827c35a9ed3ee6e1`, `hash_scheme=ast-v1`, `status=active`,
`registered=2026-06-26`. STOP if hash/scheme differ from `docs/model_documentation.md` —
report CANDIDATE IDENTITY MISMATCH; do not "fix" by re-hashing or re-registering.

### 2 — Liveness alerts
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener && python3 tools/forward_validation_liveness_monitor.py; cat artifacts/forward_validation/LIVENESS_STATUS.json
```
(The monitor writes only its own status artifact — never evidence; exit 1 = alerts present.)
Interpret per alert: `stale_live_capture` / `hardfail_skipped_capture` = feed
problem (infrastructure); `candidate_hash_mismatch` = identity problem;
`xbi_freshness` = benchmark problem; `rankings_mismatch` / `duplicate_capture` =
capture-integrity problem. A hard-failure day with NO capture is CORRECT
behavior, not a missed window to backfill.

### 3 — Eligible-window count
```bash
python3 - <<'EOF'
import json
rows=[json.loads(l) for l in open('/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/forward_validation/captures.jsonl') if l.strip()]
live=[r for r in rows if r.get('capture_mode')=='LIVE' and r.get('eligible_for_mandate')]
latest = (rows[-1].get('as_of_date') or rows[-1].get('date')) if rows else None  # legacy v1 rows use 'date'
print(f"captures={len(rows)}  eligible_LIVE={len(live)}  latest={latest}")
EOF
```
Eligibility (code-enforced, `tools/run_forward_validation.py`): LIVE ∧ quality PASS ∧
model-hash match ∧ benchmark available ∧ realized `xs_5d`. Legacy `fv_capture.v1`
rows and REPLAY rows never count. Do not hand-count fills.

### 4 — Window stats
Read `artifacts/forward_validation/WEEKLY_SUMMARY.md` (do not regenerate — the
summary tool writes files). One window per ISO week; overlapping/daily t-stats
are context only, never the gate.

### 5 — Classify (exactly one)

- A. Evaluator healthy / evidence accruing
- B. Evaluator healthy / insufficient live windows (<20) — normal until ~mid-Nov 2026
- C. Evaluator unhealthy (liveness alerts) — infrastructure, not alpha
- D. Candidate identity mismatch
- E. Stale or missing benchmark
- F. Rankings mismatch
- G. Replay contamination suspected (REPLAY rows near eligibility counts)
- H. Hard-failure capture correctly skipped
- I. Mandate evidence complete (≥20 eligible windows) — ready for human review

## Report format

Candidate (hash/scheme/registered) · repo HEAD · latest capture date+mode ·
eligible LIVE windows N/20 · scope = frozen Top-30 EW by `actionable_rank` ·
metric = 5d excess vs XBI, ISO-week de-overlap · descriptive mean XS + weekly
non-overlapping t (context) · liveness alerts · quality/DQ status · open
governance blocks (DEM HOLD; h20d HOLD; 13F observation-only) · unresolved
operator actions (e.g. liveness cron not installed).

## Human decision boundary

Terminal line must be exactly one of:

- "Evidence is NOT sufficient to request a human governance review." (states A–H)
- "Evidence IS sufficient to request a human governance review." (state I only)

Never output "promote", "deploy", "lift the freeze", or any auto-approval.
