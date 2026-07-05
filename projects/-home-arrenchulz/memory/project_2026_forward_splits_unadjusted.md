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

**FIX MERGED — PR #475 (merge commit `287a23de`, 2026-07-05).** Operator cleared+merged as a
data-correctness fix during the DEM Top-30 NO_MODEL_CHANGE window. Commit `5dbb3680` on branch
`fix/drawdown-recent-split-adjust` → merged to main. Freeze context: INC-2026-06-20 scoped
freeze LIFTED 2026-06-24 ([[scoped-work-freeze-2026-06-22]]).
⚠️ **OPEN FOLLOW-UP (not yet done):** the fix is on main but the **shared checkout / cron
does NOT auto-pull** (checkout on branch `fix/sync-hermes-skills-dual-map-drop`), so it is
NOT live in production yet. Next: deploy `run_screen.py` to the shared checkout (as done for
PR #453) → re-run 2026-07-03 snapshot → confirm IMMP flips to eligible → note the
universe-membership shift in the forward-validation log. Isolated clone `~/biotech_mltx_fix`,
branch `fix/drawdown-recent-split-adjust`, commit **5dbb3680** (NOT pushed). Approach:
in the recent-split fallback in `run_screen._hydrate_drawdown`, if `corporate_actions.json`
confirms a real split, scale the restored series via `cumulative_split_factor` (same basis
as PR #474); genuine crashes (no registry entry) keep raw deep drawdown. New
`_corp_action_split_adjust` helper + optional `corporate_actions` param (default-loads,
fail-open). Only the fallback path changes. Validated on real 2026-07-03: IMMP −0.868→
−0.317 (now ELIGIBLE), GOSS −0.954→−0.770, MLTX unchanged −0.145. 50 hydrate + 40
split/outlier tests pass; no new lint. **To ship:** confirm freeze/governance → push branch
(git-guardrails hook blocks `git push`; operator runs it via `! ...`) → open PR → re-run
2026-07-03 snapshot to confirm IMMP flips eligible in production. Full writeup:
`scratchpad/FINDING_2026_forward_splits_unadjusted.md`. Root cause detail above.
