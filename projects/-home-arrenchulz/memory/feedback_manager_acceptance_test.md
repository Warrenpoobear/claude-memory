---
name: Manager onboarding requires acceptance test
description: Every new 13F manager addition must use tools/onboard_manager.py (registry + historical backfill + acceptance test in one shot). Never edit manager_registry.json by hand.
type: feedback
originSessionId: a773d6d6-8ca8-4bb1-9107-deded3eaf3f1
---
Every new 13F manager addition must use `tools/onboard_manager.py` — never edit `production_data/manager_registry.json` directly.

**Why:** The integration path (registry → 13F PIT cache → institutional_summary → coinvest → selector → rankings) has 6 silent-fail steps. Manual editing also forgets historical backfill, which leaves the new manager invisible in any re-run of an old snapshot. The script is the deterministic gate.

**How to apply:**
- One-shot onboarding: `python tools/onboard_manager.py --cik <CIK> --name "<Name>" --aum-b <X.X> --style <style> --tier elite_core --notes "..."`
  - Step 1: appends to registry, recomputes `total_elite_aum_b`, bumps `last_updated`
  - Step 2: backfills every existing `data/caches/sec_13f/PIT/<date>/` with the new CIK (filings_lookback_n=40 ≈ 10y of quarterly history; merges with existing `index.json` so other managers are untouched)
  - Step 3: warms today's date (creates new PIT dir if absent)
  - Step 4: runs `tools/test_manager_integration.py --cik <CIK>` and exits with its rc (0 = 6/6)
- Skip flags for partial reruns: `--skip-registry` (already added), `--skip-backfill`, `--skip-current`, `--skip-test`
- Underlying primitive: `tools/warm_13f_cache.py` now supports `--ciks 1234567` and `--existing-pit-dirs` for any single-manager re-warming or backfill operation
- Confirm 6/6 PASS before reporting done. The 6 gates: registry, cache, overlap, inst_summary, coinvest, production
