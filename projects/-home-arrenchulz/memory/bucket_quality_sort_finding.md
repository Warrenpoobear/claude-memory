---
name: Within-bucket quality sort research (2026-03-27)
description: BQS tiebreak in binary_now/build_window is the strongest single candidate at +0.059pp 84d hedged
type: project
---

## Within-Bucket Quality Sort Finding (2026-03-27)

### Three candidates tested

| Candidate | Change | 84d hedged | Verdict |
|-----------|--------|-----------|---------|
| cal_alpha_off | Remove calendar alpha (w=0.3→0.0) | +0.042pp | NEEDS_MORE |
| **bucket_quality_sort** | **Enable BQS tiebreak in binary_now** | **+0.059pp** | **NEEDS_MORE (strongest)** |
| combined (both) | Both changes together | +0.046pp | NEEDS_MORE |

### Key insight

Bucket quality sort is the **strongest single candidate** because it targets the exact gap identified in the quant audit: within A-tier binary_now, all names currently sort by optionality alone, but BQS differentiates by:
- Family weight (REGULATORY > CLINICAL)
- Phase (Phase 3 > Phase 2)
- Source reliability (SEC 8-K confirmed > CTgov calendar)
- Design quality

This moves hard-catalyst SEC-confirmed names (PVLA 0.87, SRRK 0.82, XENE 0.94) above soft CTgov-only names (ARTV 0.51, CCCC 0.47) within the same bucket.

### Not additive

Combined < sum of individuals (+0.046 < 0.042 + 0.059). Both changes reduce sort-key noise, so their effects partially cancel.

### inst_delta_z is 0.0 everywhere

The `quality_plus_institutional` mode degrades to `quality_primary` in practice because 13F data is sparse for this universe. The institutional weight (0.3) has no effect currently.

### Recommendation

Shadow `bucket_quality_sort` as the v1.12.0 candidate. If April evidence strengthens it past +0.20pp, promote. If not, consider increasing BQS weight or adding source-quality-aware tiebreakers.

**Why:** This is the most actionable model improvement identified. It doesn't add new signals — it uses existing BQS infrastructure that's already computed but not active in binary_now/build_window.

**How to apply:** Human decision after April outcomes. Run `eval_forward_returns` with the candidate on post-April snapshots.
