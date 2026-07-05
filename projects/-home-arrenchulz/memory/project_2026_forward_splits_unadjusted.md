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

Production `de_drawdown` (and same-basis RSI/beta/alpha) is **not** applying
`corporate_actions.json` split factors to **2026** forward splits. Splits ≤ 2025-09-29 are
adjusted (MLTX correct at −14.5%); 2026 splits carry RAW unadjusted drawdowns. Cutoff
between Sep 2025 and Feb 2026 → **stale split-adjusted price source/cache** that stopped
picking up new splits. The 2026-07-03 evening rerun also produced unadjusted values → live
bug, not a stale snapshot.

**Concrete harm:** deep-drawdown gate = −0.40 (hard, require_both).
- **IMMP** (fwd split 2026-03-13): true adj dd −31.7% (above gate → should be ELIGIBLE) but
  stored raw −86.8% → **wrongly excluded** (`deep_drawdown`).
- **GOSS** (fwd split 2026-02-23): stored raw −95.4% vs adj −77.0%; value wrong but stays
  excluded (< −40%).

Discovered via the audit fix ([[project-audit-split-adjust-fix-2026-07-05]], PR #474), which
now correctly surfaces GOSS/IMMP instead of masking them (they're not held → held-scoped
gate stays quiet; appear in price_recompute_diff + root_cause).

**NOT fixed** — production feature (Tier 3, frozen-adjacent); needs operator clearance.
Next: trace where the drawdown price basis loses 2026 splits (PIT cache / warm_price_cache /
run_screen feature load); scope all 2026-dated splits in `corporate_actions.json`; fix at
source + regression test; re-run snapshot to confirm IMMP becomes eligible. Full writeup:
`scratchpad/FINDING_2026_forward_splits_unadjusted.md` (2026-07-05 session).
