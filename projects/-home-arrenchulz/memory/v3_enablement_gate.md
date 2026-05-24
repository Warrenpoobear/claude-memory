---
name: V3 phase scores enablement gate
description: Promotion gates and approval record for --phase-scores-v3 default-on enablement
type: project
---

V3 phase scores (Spec 024) **DEFAULT-ON APPROVED** (2026-03-16). 9-date multi-date aggregate passed all gates.

**9-date aggregate metrics:**
- Mean top-60 overlap: 99.43% (threshold >= 93%)
- Min top-60 overlap: 98.3% (threshold >= 90%)
- Max rank shift: 13 (threshold <= 30)
- Worst A-tier regression: 0
- Flagged dates: 0

**Why:** v3 is a downward survivorship correction with bounded translation (down=-2, up=+0). The multi-date compare across a real window passed comfortably inside all promotion thresholds.

**How to apply:**
- v3 is now the default in `run_screen.py` (no flag needed)
- Rollback: `--phase-scores-v1` restores Wong reference scores
- `--phase-scores-v2` still available as opt-in
- Metadata stamps `phase_scores_version` in every snapshot
- Survivorship caveat on underlying priors is handled by bounded caps + Phase 4 Wong fallback
- Monitor one release window, then treat as fully promoted
