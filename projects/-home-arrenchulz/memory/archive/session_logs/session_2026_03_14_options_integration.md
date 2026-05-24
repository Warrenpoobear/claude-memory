---
name: session_2026_03_14_options_integration
description: Options integration buildout + research correction — prior alpha_candidate verdicts invalidated by CTGov PCD noise; hard-catalyst subset has 0 outcomes; crowding penalty ABANDON
type: project
---

## 2026-03-14 Sessions — Options Integration, Backtests, Correction

### Earlier session (9 commits): infrastructure + observability
1. `01aa7c72` — Coverage quality artifact (v1)
2. `edf6eead` — Options readiness gate aligned to Step-10 secondary reg path
3. `a13f04f6` — PoS divergence research study
4. `c0dba7c6` — Subgroup splits + abs_pos_divergence + design spec
5. `199e36d1` — Shadow diagnostic: market_model_disagreement in every run
6. `c9f58772` — Manual review of 16 high-disagreement names + catalyst_days<=180 pre-filter
7. `5497457e` — Term structure validator
8. `dcdb901d` — Crowding penalty harness
9. `d823ef6c` — Options freshness tracking + stale-data guards

### Later session (15+ commits): options infra + hard catalyst classifier
- Construction overlays, Massive chain analytics, BS Greeks, IV solver, IV surface
- Straddle mispricing eval, event-move lookup table
- **Key commit `0c0fb9b8`**: hard catalyst classifier + daily options review queue — adds `catalyst_event_type`, `catalyst_source`, `is_hard_catalyst` to enriched dataset; `--hard-catalysts-only` filter on both studies

### Research correction session: all three backtests run
1. **Options alpha**: prior `alpha_candidate` (IC=0.264 signed_gap) was INVALID — all 111 outcome rows were CTGov PCD calendar noise (avg abs_gap 2.5%). Hard-catalyst subset: 8 rows, 0 realized outcomes → `insufficient_sample`.
2. **PoS divergence**: prior `alpha_candidate` (IC=-0.193 contrarian) same CTGov contamination. Hard subset: 0 outcomes → `insufficient_sample`. Remains shadow diagnostic only.
3. **Crowding penalty**: 816 events, crowding_z IC=-0.013 → **ABANDON**. No component survives double-sort or incremental IC tests.
4. **Code fix**: `--cached-only` flag added to `build_precatalyst_options_panel.py` (skips S3 downloads for uncached dates)

### Current operational posture
- **No valid options alpha verdict exists** — deferred pending hard-catalyst outcomes
- **Next valid rerun**: after BIIB (~April 3), CELC/PVLA/TBPH (~April 1) events land
- **Live artifact**: daily options review queue (hard-catalyst status, cheap/rich straddle, disagreement, term-structure flags, extreme skew) — use this for daily decisions, not the alpha studies
- **Crowding lane**: closed

**Why:** The hard-catalyst refactor exposed that the entire outcome set was soft calendar milestones. No options signal can be evaluated until real binary events resolve.

**How to apply:** Do not cite options alpha IC numbers as evidence for any promotion decision. Wait for hard outcomes, then rerun with `--hard-catalysts-only`.
