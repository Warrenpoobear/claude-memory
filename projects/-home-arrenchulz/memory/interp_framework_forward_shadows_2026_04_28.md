---
name: Interpretation framework for forward shadows (locked 2026-04-28)
description: How to read the three forward validators (inst_delta CURRENT vs CF; cross-signal HL/HH/LH/LL; bucket persistence Jaccard). Locked thresholds, rolling-view discipline, don't-overreact principle.
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
**Locked at session close 2026-04-28. Apply to every future read until h60d (2026-07-21) or until the user explicitly revises.**

**Why:** Three forward validators run starting 2026-04-29. Without a fixed interpretation framework, ad-hoc reads will drift toward optimism on any short-term win. This memory pins the rules of inference.

**How to apply:** Before drawing any conclusion from a checkpoint, check this memory and apply the thresholds verbatim. Do not invent new ones, do not loosen them.

### What's running
1. **CURRENT vs COUNTERFACTUAL return shadow** (`inst_delta_forward_shadow_T0_2026_04_28.md`) — tests whether inst_delta cohort shock created false alpha.
2. **Cross-signal bucket forward shadow** (`cross_signal_forward_shadow_T0_2026_04_28.md`) — tests whether DEM-high / cross-signal-low is orthogonal alpha or false-positive risk.
3. **Bucket persistence diagnostic** (in cross-signal logger, commit `113f1018`) — tests whether HL is a coherent population or threshold churn.

### HL Jaccard interpretation (per-day, vs prior bucket file)
| Jaccard | Read |
|---|---|
| > 0.70 | Good. HL is coherent enough to study. |
| 0.40 – 0.70 | Mixed. Bucket exists, but boundary churn is meaningful. |
| < 0.40 | Weak. HL is probably not a stable signal population yet. |

### Don't-overreact discipline
- **One day's Jaccard is not a verdict.** Use rolling views.
- Track: 3-day median HL Jaccard, 5-day median HL Jaccard, HL count stability, repeat entrant/exit names.
- The early-signal hierarchy: persistence first, returns second. If HL doesn't stay populated by roughly the same names, h20d returns will mostly measure bucket-definition noise.

### What to inspect at each checkpoint
1. **HL Jaccard** (cross-signal logger output)
2. **CURRENT vs CF top-10 / top-20 attribution** (inst_delta forward compare)
3. **Contribution from `ABVX, COGT, MIRM, NRIX, ORKA, ZYME`** (artifact-name tracking)

Do **not**:
- Tune thresholds.
- Add cuts.
- Promote names.
- Change cutoffs.
- Treat single-day outperformance as validation.

### Current model state (2026-04-28 close, frozen baseline)
- DEM is structurally stable enough for forward validation.
- The top-30 boundary is thin (26 names within 0.10 of cutoff).
- The top-10 is fragile (artifact concentration).
- The top-50 is the most honest monitoring cutoff today.
- Cross-signal corroboration is weak (top-30 mean agreement = 0.10) but not yet damning.
- **No production change is justified.**

### Decision gates (firm)
- Do not change production cutoff before **h20d (2026-05-26)** AND post-13F refresh (~2026-05-15).
- Final shadow verdict: **h60d (2026-07-21)**.
- If HL persistence trends < 0.40 across 5+ days: bucket is not coherent; do not interpret HL returns at h20d.
- If CURRENT outperforms CF only via the 6 artifact names: not alpha, cohort luck.
- If CF matches/beats CURRENT by h20d: "inst_delta cohort shock created false short-term confidence" (matches user's pre-registered hypothesis).

### Companion memories
- `regime_post_cohort_change_distortion_2026_04_28.md` — do-not-fix policy
- `inst_delta_forward_shadow_T0_2026_04_28.md` — return-shadow methodology
- `cross_signal_forward_shadow_T0_2026_04_28.md` — bucket-shadow methodology
