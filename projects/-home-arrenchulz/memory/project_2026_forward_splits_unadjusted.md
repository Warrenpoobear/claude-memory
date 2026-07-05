---
name: project-2026-forward-splits-unadjusted
description: OPEN BUG — production drawdown feature not split-adjusting 2026 forward splits; IMMP wrongly excluded
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: 2cfb5b04-5a07-4795-9751-4810a687f2ed
---

# OPEN BUG — 2026 forward splits not adjusted in production drawdown feature (2026-07-05)

CONFIRMED root cause (not corporate_actions/cache — a heuristic in run_screen):
`run_screen._hydrate_drawdown` reads RAW `price_history.csv` and split-adjusts via
`_filter_price_outliers` (day-over-day <−75% = forward split) which TRUNCATES to the
post-split regime. **Bug at run_screen.py lines 2466–2483:** if the truncated series has
`< MIN_BARS_FOR_ESTIMATE` (126 bars), a fallback RESTORES the full unfiltered raw series
("WINDOW cap uses post-event regime anyway" — FALSE when split is inside the 252-bar
window). So any forward split with **<126 post-split trading days (~6 months)** gets a
false deep drawdown from the pre-split high; self-heals after 126 bars. Post-split bars:
MLTX 191 (✅ correct −14%), GOSS 91 (❌ raw −95%), IMMP 77 (❌ raw −87%).
Beta/alpha/RSI (same raw basis) may also be distorted by the split-day return — verify.

**Concrete harm:** deep-drawdown gate = −0.40 (hard, require_both).
- **IMMP** (fwd split 2026-03-13): true adj dd −31.7% (above gate → should be ELIGIBLE) but
  stored raw −86.8% → **wrongly excluded** (`deep_drawdown`).
- **GOSS** (fwd split 2026-02-23): stored raw −95.4% vs adj −77.0%; value wrong but stays
  excluded (< −40%).

Discovered via the audit fix ([[project-audit-split-adjust-fix-2026-07-05]], PR #474), which
now correctly surfaces GOSS/IMMP instead of masking them (they're not held → held-scoped
gate stays quiet; appear in price_recompute_diff + root_cause).

**NOT fixed** — production feature (Tier 3, frozen-adjacent); needs operator clearance.
Trace COMPLETE (root cause above). Fix options: (1 best) replace heuristic truncation with
`corporate_actions.json` scaling (`cumulative_split_factor`, same as PR #474) — unifies
feature+audit; (2) cap drawdown peak at split date in the fallback; (3) interim: emit
`drawdown_missing_reason="recent_split_insufficient_history"` so the gate can't fire on a
false deep value. Then re-run 2026-07-03 → confirm IMMP flips to eligible. Full writeup:
`scratchpad/FINDING_2026_forward_splits_unadjusted.md` (2026-07-05 session).
