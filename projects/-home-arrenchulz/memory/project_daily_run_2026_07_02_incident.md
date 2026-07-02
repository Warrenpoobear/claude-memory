---
name: project-daily-run-2026-07-02-incident
description: 2026-07-02 daily run failure chain — R² ZeroDivisionError + stale ipo_dates.json collapsing the universe; both fixed
metadata: 
  node_type: memory
  type: project
  status: shipped
  related: 
    - project-price-append-multiindex-bug-2026-07-01
  originSessionId: 5fd143bf-4dee-427b-b532-a776caecfd37
---

The 2026-07-02 daily production run failed all day (watchdog retried every ~30 min). Two stacked bugs, both fixed + committed 2026-07-02:

**1. ZeroDivisionError (crash).** `run_screen.py` `save_validation_snapshot` logged a coinvest size-residualization R² whose denominator is `_var_x * var(y)`; the guard only checked `_var_x > 1e-12`, so a cohort with zero coinvest z-score variance → `var(y)=0` → div-by-zero. A **diagnostic log line** crashed the whole screen → no rankings.csv → all gates FAIL → not promoted. Fix: guard both `_var_x` and `_var_y`. Merged PR #454.

**2. Stale `ipo_dates.json` → universe collapse (the important gotcha).** Once the crash was fixed, the screen produced only ~12 tickers (`de_vol_60d` 100% missing). Root cause: `production_data/ipo_dates.json` (built by `tools/build_ipo_dates.py` from `price_history.csv`, giving per-ticker first/last price date) was stale — 356/371 tickers frozen at `last_price_date=2026-05-17`. run_screen's PIT **survivorship delist filter** (run_screen.py ~9917) excludes tickers whose `last_price_date < as_of − 45 days`. Cutoff: **07-01 → 2026-05-17** (`05-17 < 05-17` false → kept); **07-02 → 2026-05-18** (`05-17 < 05-18` true → 356 excluded). So a stale ipo_dates.json silently crosses the 45-day threshold overnight and collapses the active universe — with NO error, just a tiny universe. Tickers absent from ipo_dates (newest adds) are kept (conservative), which is why the survivors were the 06-21 IPO adds. Fix: `python3 tools/build_ipo_dates.py` (regenerates from current price_history) → 349 current, universe restored to 302/229, 07-02 promoted (WARN).

**Lesson / how to apply:** if the screen suddenly evaluates far fewer tickers (check `total_evaluated`/`active_universe` in screen_output summary, or eligibility n_total), suspect **stale ipo_dates.json** crossing the 45-day delist cutoff — regenerate it. Both fixes deployed to shared checkout working tree AND committed to branch `fix/sync-hermes-skills-dual-map-drop` (commit `52fe61d6`, pushed); durable once that branch merges main. Push required the temp git-hook exception dance (see [[project-price-append-multiindex-bug-2026-07-01]]).
