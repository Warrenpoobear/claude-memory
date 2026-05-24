---
name: 2026-03-16 session — v3 clinical priors
description: Clinical design backtest, survivorship-adjusted v3 priors, default-on approved after 9-date aggregate compare
type: project
---

## Session output (2026-03-16, part B + promotion)

**Commits**: `4167aa9c` (backtest + v3 builder), `8b398cd5` (v3 wiring + compare + approval)

### Clinical design backtest (Spec 024)
- Phase AUC=0.581, +endpoint AUC=0.598 (modest but directionally useful)
- Survivorship bias: 63.6% observed → 20.6% worst-case → 41.5% plausible
- v2 empirical beats flat/Wong on Brier (0.2252 < 0.2322), cal slope 0.73
- Full Hessian logistic solver replaces divergent diagonal approximation

### V3 priors artifact
- `production_data/clinical_pos_priors_v3.json` (schema `clinical_pos_priors.v3`)
- Survivorship-adjusted rates: P2=25.7%, P3=53.4%, P4=Wong fallback
- Metadata: `phase_notes`, `fallback_overrides`, `survivorship_assumptions`

### Score translation calibration
- v3a (down=-4, up=+1): proxy max_shift=72, REJECTED
- v3b (down=-3, up=+1): proxy max_shift=59, HOLD
- **v3c (down=-2, up=+0): APPROVED** — full DEM compare passes all gates

### Promotion to DEFAULT-ON (2026-03-16)

9-date aggregate compare passed all gates:
| Gate | Value | Threshold |
|------|-------|-----------|
| Mean top-60 overlap | 99.43% | >= 93% |
| Min top-60 overlap | 98.3% | >= 90% |
| Max rank shift | 13 | <= 30 |
| Worst A-tier regression | 0 | 0 |
| Flagged dates | 0 | 0 |

Implementation: v3 is now default in `run_screen.py`; `--phase-scores-v1` rollback available.

**Why:** v3 is a downward survivorship correction. Bounded translation and Phase 4 Wong fallback protect against over-correction. Multi-date evidence is strong.

**How to apply:** v3 is the default path. Use `--phase-scores-v1` to rollback. Metadata always stamps version.
