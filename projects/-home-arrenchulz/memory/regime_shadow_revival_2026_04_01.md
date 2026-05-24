---
name: regime_shadow_revival
description: Regime shadow — VIX-gated RR fix shipped 2026-04-05, switching policy still NEGATIVE, rich is contrarian not directional
type: project
---

## Regime Shadow (updated 2026-04-05)

**Runner**: `tools/run_regime_shadow.py` → `artifacts/regime_shadow/{date}.json`
**Evaluation**: `scripts/research/regime_evaluation.py` → `artifacts/regime_evaluation/`
**Daily production**: Step 5k.11c (shadow) + Step 5k.11d (evaluation update)
**Backfill**: 1,633 daily obs (2020-01-01 to 2026-04-03), cached in `data/regime_backfill_cache/`

### Bugs Fixed (2026-04-05)

1. **xbi_vs_spy_30d input**: live shadow was feeding XBI absolute return instead of XBI-SPY relative. Fixed in `run_regime_shadow.py`.
2. **Fund flows missing from backfill**: IBB + XBI volume proxy now wired into `backfill_regime_history.py`. Shifted 73 days from stress→BULL.
3. **RECESSION_RISK / VIX disagreement**: yield curve inversion alone was driving 238 RR days, 60% with VIX < 20 (2022-2024 structural inversion). Fixed with VIX-scaled attenuation in `regime_engine.py`:
   - VIX < 15 → RR contribution = 0% (fully suppressed)
   - VIX 15-20 → RR contribution = 30%
   - VIX >= 20 → RR contribution = 100% (VIX confirms stress)
   - Result: RR days 238→96, all now VIX-confirmed. 83/83 tests pass.

### Verdict: Switching Policy Still NEGATIVE

- **Switching delta**: -5.04% at 5d (was -7.93% before fixes)
- **Bad flip rate**: 56% (10/18)
- **Rich labels CONTRARIAN**: CREDIT_CRISIS +1.66% (t=4.14), VOL_SPIKE +3.27% (t=2.86)
- **Simple wins disagreements**: 58.1% vs 41.9% (was 55.4% vs 44.6%)
- `simple_bull + rich_bearish` → +0.81%/wk (t=4.15) — strongest signal
- `simple_bear + rich_bull` → -0.83%/wk (t=-2.77) — significant negative

### Status

- Switching policy: FROZEN (confirmed by evidence)
- Live shadow: accumulating daily, evaluation harness auto-updates
- Full analysis: `artifacts/regime_evaluation/regime_analysis_2026_04_05.md`

**How to apply:** Do NOT use rich engine for construction switching. Keep as dashboard diagnostic.
