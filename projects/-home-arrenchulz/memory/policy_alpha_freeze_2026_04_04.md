---
name: Alpha Stack Freeze & Promotion Policy v2
description: Production freeze, mandatory promotion checklist v2, pairwise ordinal-only, research queue narrowed to execution-delta + Herald precision
type: feedback
---

## Alpha Stack Freeze (2026-04-04)

**Production is frozen. No new promotions until they pass Checklist v2.**

**Why:** Spec 055 statistical upgrade showed the prior promotion bar was too permissive. Coinvest NW-t=1.45 cross-sectionally (weaker than signal-card t=3.05 suggested). Nothing survives the full battery (FM + bootstrap + FDR + LOSO). The new QA layer is doing its job — it prevents overclaiming alpha, not creating it.

**How to apply:**

### Frozen Production Stack
- **B6 selector** (coinvest 65% + inst_delta 35%) — stays as baseline
- **Pairwise + Tilt B** — stays in production
- **No new signal promotions** until they pass Checklist v2

### Pairwise = Ordinal Only
- ECE = 0.19 → scores are NOT calibrated as probabilities
- Do NOT use pairwise scores for rank-weighting or confidence-based sizing
- Keep for ordering names only; sizing remains ruleset/risk-layer driven
- Do NOT revisit rank-weighting until calibration improves below ECE < 0.05

### Mandatory Promotion Checklist v2
Every future signal promotion requires ALL of:
1. Signal card: selector Δ > 0, ranker IC > 0, coverage ≥ 40%
2. Fama-MacBeth: incremental NW-t ≥ 1.96 after controls (coinvest, inst_delta, financial)
3. Bootstrap: 95% CI on portfolio delta excludes zero (block=6, n=10000)
4. BH FDR: q-value < 0.10 within testing family
5. LOSO robustness: worst-slice delta still positive
6. Year stability: negative in ≤ 1 of tested years

### Closed Lanes (do not reopen)
- **Clinical** as selector/ranker — dead across every robustness slice
- **Options-as-alpha** — 37 signals tested, all fail. Revalidated 2026-04-05 after coverage upgrade, still NO GO.
- **Generic momentum** as separate factor
- **More clinical-score composites**
- **Form 4 insider** — revalidated 2026-04-05. FM NW-t=1.23 (was 1.98), fails 4/6 Checklist v2, selector +0.12pp (noise), ranker IC negative. Institutional block already captures.

### Shadow Only
- (None — all former shadow candidates have been revalidated and closed or remain as overlay-only)

### Active Research Queue
- **Execution/timeline delta** (AACT changes) — cleanest remaining biotech-native lane, orthogonal to institutional+risk
- **Herald precision** — catalyst timing quality (event_type_score passed Checklist v2 as overlay, not promotable as alpha)
- Both must be evaluated under Checklist v2 before any promotion decision
