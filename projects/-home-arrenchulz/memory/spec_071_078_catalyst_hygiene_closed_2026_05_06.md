---
name: Spec 071 + 078 catalyst hygiene closed (2026-05-06)
description: Spec 071 Lane 1 (CTGOV terminal-status reject) + Spec 078 Lanes A+B (catalyst_quality classifier) shipped to origin/main, monitor-only
type: project
status: shipped
originSessionId: e5879815-4335-4bbf-9ad9-eb9f5fc2dbd1
---
Spec 071 Lane 1 + Spec 078 Lanes A+B closed and pushed to `origin/main` 2026-05-06.

**Pushed commits:**
- `c08b6062` fix(catalyst): hard-reject CT.gov catalyst credit for withdrawn / approved-for-marketing statuses (spec 071 lane 1)
- `02f10a76` feat(catalyst): add catalyst quality hygiene gate (spec 078 lanes A + B)
- `origin/main` now at `02f10a76`

**Scope (hygiene/risk-control only):**
- Spec 071 L1: `CTGovStatus.is_lane1_reject` covers WITHDRAWN, TERMINATED, SUSPENDED, APPROVED_FOR_MARKETING, NO_LONGER_AVAILABLE — applied at both `detect_calendar_catalysts` and `detect_readout_window_catalysts` filter sites in `catalyst_diagnostics.py`. Zero immediate ranking changes on 2026-05-06 snapshot.
- Spec 078 A: non-binary corporate event types (EARNINGS_RELEASE, INVESTOR_DAY, PARTNERSHIP, MA_ACTIVITY, LICENSING_DEAL, CONFERENCE_*, IR_EVENT, PRESS_RELEASE_EVENT) suppressed in `convert_corporate_catalyst_to_v2()` (`module_3_catalyst.py`).
- Spec 078 B: per-row `catalyst_quality` field (`corporate_update` / `low_confidence` / `binary_alpha` / `registry_only`) written by `classify_catalyst_quality()` in `run_screen.py` → `save_validation_snapshot()`. Diagnostic-only; not in selector/ranker/EV.

**Verifications passed before push:**
- 8 expected files only (`.gitignore`, `artifacts/audit/spec_071_lane1_diff_2026-05-06.md`, `catalyst_diagnostics.py`, `ctgov_adapter.py`, `module_3_catalyst.py`, `run_screen.py`, `tests/test_catalyst_event_graph.py`, `tests/test_catalyst_quality_gate.py`)
- 147 catalyst tests pass (`tests/test_catalyst_quality_gate.py` + `tests/test_catalyst_event_graph.py`)
- No runtime data committed (`data/expression_decision_log.jsonl`, `production_data/short_interest.json` left unstaged in working tree)
- No selector/ranker/EV weight changes
- Only `artifacts/audit/spec_071_lane1_diff_2026-05-06.md` tracked under `artifacts/audit/`

**.gitignore narrowed** (Spec 071 commit, after concern raised about broad un-ignore exposing future JSON audit artifacts):
```
artifacts/*
!artifacts/audit/         # un-ignore dir for recursion
artifacts/audit/*         # re-ignore everything inside
!artifacts/audit/*.md     # allow only markdown
!artifacts/**/*.md
!artifacts/**/*.txt
```
Verified: existing `artifacts/audit/*.json` files (digest_news_reconcile, inst_delta_attribution, etc.) are properly ignored; only `*.md` is trackable.

**Catalyst_quality smoke (simulated against 2026-05-06 09:47 ET rankings.csv, 299 rows):**
- `registry_only` 179, `binary_alpha` 82, empty 38, `corporate_update` 0, `low_confidence` 0
- Top-30 / Top-60 flagged (corp_update + low_conf) = 0
- Consistent with hygiene-gate behavior; flagging only triggers on edge cases (false / stale catalysts)

**Why:** Both specs landed strictly as hygiene/risk-control (no selector/ranker/EV impact); closure recorded in case future debugging needs to confirm what changed at this date.

**How to apply:**
- Do NOT add more catalyst lanes now (per user direction 2026-05-06).
- On next production snapshot: report `catalyst_quality` distribution + top-30/60 counts + names flagged as non-binary corporate update / low_confidence / registry_only / false-stale. Do NOT change scoring based on the first observation.
- Wait for post-13F window close (~2026-05-15) and sufficient resolved-event counts before touching Specs 079–082.

**Related artifacts:**
- Local branch `save/ir-sources-populate-2026-05-06` preserves unrelated commit `b05becd2` (`production_data/company_ir_sources.json` IR URL coverage 12% → 90.6%, classifier escalation pool fix). Not pushed; treat as separate task.
- Stash `stash@{0}` "preserve runtime data and untracked before clean push 2026-05-06" holds pre-`83f5e751` versions of `data/expression_decision_log.jsonl` + `production_data/short_interest.json`. Origin's `83f5e751` reset both; stash retained pending user decision to drop.
- Local branch `spec-071-078-push` retained pending user decision (carries superseded `da7ba8f8` / `8b198065` SHAs with the broad `.gitignore` rule; content represented cleanly on origin/main).
