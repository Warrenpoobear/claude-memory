---
name: New source work priorities (2026-03-21)
description: Ranked priorities for new information sources to improve DEM scoring, after proving quality tiebreaks with existing signals are economically immaterial
type: project
---

## Context
Quality tiebreaks tested at three scopes (Specs 030, 031) — all structurally valid but
economically immaterial. Optionality anchor is near-optimal with current signals. New
scoring improvement requires a genuinely new information source.

## Priority Ranking (updated 2026-03-21 end-of-session)

### Already in repo, underused — HIGHEST ROI

**1. Competitive intensity — oncology-specific crowding penalty (BEST NEXT SPEC)**
- Cross-universe signal is confounded (U-shaped, see `competitive_intensity_ic_finding.md`)
- But oncology-only IC=-0.055 (t=-2.76), uncrowded outperforms by +5.35pp at 63d
- Engine already built, 39% of universe is oncology — no collection work needed
- Next step: dedicated spec with oncology gate, interaction test with optionality

**2. ~~Regulatory pathway quality~~ — AUDITED, coverage too thin (3.8%)**
- Engine is correct: BTD +25%, ODD +18%, FT +12%, RMAT +20% PoS multiplier
- But fda_designations.json only has 20 entries / 13 universe tickers
- Most are large-cap (ALNY, REGN, VRTX) — only CELC in top-20
- Bottleneck is data collection, not engine design
- To make useful: expand from 20 → 100+ entries (FDA Orange Book, Drugs@FDA, 8-K)
- See `fda_designation_audit_2026_03.md`

**3. RR / options lane — waiting April gate**
- mean_rr IC=0.133, mean_implied_move IC=0.320 (strongest non-optionality axis)
- Governance-blocked until BIIB/CELC/PVLA/TBPH resolve (~April 1-3)
- Not a new source — already built, just pending validation

### Genuinely new sources — LOWER ROI

**4. SEC Form 4 insider transactions**
- Module 7 still PLANNED, not built. EDGAR XML parsing needed.
- NEXT_STEPS.md warns "data quality + PIT correctness is hard"
- Only pursue after cheaper existing-source lanes are exhausted

**5. FDA advisory committee voting patterns**
- Backlog: "interesting but complex and slow to build"

**6. Patent-expiry proximity**
- Backlog: "more relevant to large-cap pharma than catalyst sleeves"

### Closed lanes
- ~~PI trial count (Spec 032)~~: RESEARCH COMPLETE, NO SIGNAL
- ~~Quality tiebreaks (Specs 030, 031)~~: economically immaterial at all scopes
- ~~Cross-universe competitive_intensity_z~~: confounded, not usable as linear signal

## Decision Rules
- Do NOT propose more quality tiebreaks or mid-book reordering with current signals
- Do NOT build new ingestion before testing existing underused signals
- Only live shadow candidate with real economic upside: catalyst tilt (a08749e4)
- Oncology crowding penalty is the sharpest new research lead

**How to apply:** When asked "what should I work on next for DEM scoring", point to
oncology crowding penalty first, then FDA designation audit, then wait for April options
gate. Form 4 is last resort.
