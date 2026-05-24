---
name: Quarantine fixes require before/after snapshot diff
description: When landing a data-quality quarantine/normalization fix, the patch artifact must include a before/after snapshot diff listing exactly which tickers/rows lost values and which downstream fields degraded. Prevents a "fix" from silently changing too much of the model.
type: feedback
originSessionId: 70ef2e44-ae3e-43e6-90ff-957a934f5373
---
When landing a data-quality quarantine, normalization, or schema-validation fix, the patch artifact must include a **before/after snapshot diff** showing exactly which tickers/rows lost values and which downstream fields degraded as a result. Reviewer should be able to read the diff and tell at a glance whether the blast radius matches the intended fix.

**Why:** Quarantine fixes can pass unit tests, look correct in code review, and silently degrade dozens of rows that downstream attribution, EES, options, or scoring layers depended on. The IV unit-drift fix (2026-04-25 diagnosis) is the canonical example — 38 rows out of 297 had `priced_move_pct` blowups; a fix that quarantines invalid IV could plausibly drop 38 rows or 200 rows depending on threshold choice, and the difference is invisible without an explicit row-level diff. A patch that "passes tests + looks reasonable" is not the same as a patch with bounded, audited blast radius.

**How to apply:**
- Applies to: any patch that quarantines, validates, normalizes, or schema-checks production data fields. Examples: IV unit cap, freshness gate, coverage validator, NaN-or-blank rules, dollar/decimal unit fix.
- The patch artifact (PR description, diagnosis doc, or commit message body) must include:
  - Count of rows affected before/after, by snapshot.
  - Per-ticker list of dropped/blanked field values (full list if ≤50 rows; otherwise top-N + total count + tail summary).
  - Downstream fields that degraded as a side effect (e.g., `priced_move_pct`, `implied_event_move`, `EES`, `event_ev`, ranker inputs).
  - Confirmation that scoring/ranker behavior did not change *except* through the intended degradation path.
- Does NOT apply to: pure code refactors, test additions, doc fixes, alpha promotions (those have their own Checklist v2 gate).
- If the diff shows the fix changed more than the intended scope, stop and re-scope. Do not ship a quarantine fix whose blast radius is unexpectedly large.
