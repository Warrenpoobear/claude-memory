---
name: Early calibration findings (2026-03-31)
description: First 12 CRT resolutions — DEM picking winners, RR directional 0/2, MAZE false positive, AQST edge case
type: project
---

## 12 March Resolutions (5 HIT, 7 MISS)

### DEM selection signal is real
- 3/5 HITs were DEM top-25: CELC (7), PVLA (18), KOD (23)
- All 3 unranked names were MISSes (RGNX, QURE, VRDN)
- XENE HIT at rank 60 — mid-book, not top-book

### MAZE (rank 36, MISS -35.2%) is the false positive to investigate
- Mid-pack, not bottom-decile — DEM didn't catch it
- Was it carried by catalyst proximity rather than clinical quality?
- Key question for clinical bucket decomposition: what did MAZE's clinical sub-bucket scores look like?
- If proximity dominated quality, that's evidence for catalyst type taxonomy doing real work

### AQST CRL edge case
- CRL = unambiguous MISS on regulatory dimension
- But price +6.1% (market liked resubmission path)
- Breaks naive hit-rate analysis that uses price direction
- **Action**: track "outcome" and "price direction" as separate fields in calibration rollup
- Don't use AQST to validate/invalidate DEM predictions based on price alone

### RR directional predictions: 0/2 so far
- CELC: bearish RR prediction → stock +8% on HIT (RR wrong)
- TBPH: bullish extreme prediction → Phase 3 MISS, flat price (RR wrong)
- BIIB + PVLA still pending — both must be correct for mean_rr weight-lock (≥2/4)
- **Question for Scott**: is RR signal genuinely broken, or is 2 data points too thin?

**Why:** These are the first real out-of-sample data points. The pattern (DEM picks winners, RR picks wrong) has implications for which signals get promoted.

## Next-Session Flags

1. **MAZE rank 36**: RESOLVED — acceptable false positive
   - Quality gate approach REJECTED: top-book Phase 2 names (SION, ORKA) have WORSE quality than MAZE
   - No clean threshold exists; clinical quality clusters at 0.48-0.72 across all Phase 2
   - MAZE at rank 36 tier B was mid-book; DEM correctly didn't put it top-20
   - SAE events are stochastic, not predictable from design quality

2. **AQST**: separate event outcome from price direction in calibration
   - Split into: `event_outcome` (HIT/MISS) + `price_direction` (up/down/flat)
   - Collapsing them muddies calibration — AQST is a regulatory MISS with positive price

3. **RR 0/2**: BIIB/PVLA are gating observations; discuss with Scott
   - Fork: broken signal hypothesis vs insufficient sample hypothesis
   - If both remaining fail → signal not ready
   - If both hit → still provisional (n=4 is tiny)
   - Do NOT weight-lock from current evidence

**How to apply:** Start next session with these three audits before new work.
