---
name: External biotech data sources for evaluation
description: PDUFA.BIO (free FDA calendar + ODIN approval scores), BioAPI.dev (REST API for FDA/CT.gov/PDUFA), and existing sources. For catalyst pipeline and PoS benchmarking.
type: reference
originSessionId: a773d6d6-8ca8-4bb1-9107-deded3eaf3f1
---
## New sources to evaluate

### PDUFA.BIO (pdufa.bio)
- Free FDA PDUFA calendar, filterable by ticker and therapeutic area
- ODIN AI scoring engine for FDA approval probability
- **Use case:** external benchmark for PoS signal — compare ODIN predictions against conditional_base_rate to find divergences
- Not a data API; web-based tool

### BioAPI (bioapi.dev)
- REST API: FDA alerts, ClinicalTrials.gov studies, drug applications, DailyMed labels, advisory committee calendars, PDUFA dates
- Normalized JSON with range filters and pagination
- **Use case:** programmatic catalyst data feed. Could supplement or replace parts of CT.gov pipeline and BioPharmaCatalyst scraping.

## Existing sources (for context)
- BioPharmaCatalyst: current catalyst calendar source
- CT.gov / AACT: clinical trials mirror (19,192 records, weekly refresh)
- SEC EDGAR: 13F filings (coinvest), 8-K (catalyst detection)
- DealForma: DROPPED (paid)
- Purple Book: biologics competition

### CatalystAlert (catalystalert.com, $19-39/mo)
- XGBoost catalyst impact + Random Forest LOA (BIO 2024 benchmarks), weekly retrain
- Claims 77.8% accuracy across 1,094 companies / 3,276 pipelines
- **Verdict: skip.** Same inputs we already ingest (CT.gov, EDGAR, FDA). PoS less sophisticated than our Wong et al. v3 with survivorship adjustment. 77.8% not broken down by event type. Only value = CRT benchmark comparison (free tier sufficient).

### PDUFA.BIO (pdufa.bio)
- Requires access code. ODIN AI approval probability scores.
- **Verdict: skip for now.** Access gated. PoS benchmarking possible but not urgent.

### Ozmosi BEAM
- Clinical trial versioning data for ML. Enterprise-priced.
- **Verdict: discuss with Scott as budget item if needed.** Highest-ROI external data product but likely expensive.

### BioTradingArena (biotradingarena.com, launched Feb 2026)
- Open benchmark: 317 validated biotech catalyst cases
- Each case: actual catalyst press release + trial design + prior data + related literature + stock price reaction
- Key framing: "positive" press releases can still cause selloffs if results don't meet the market's bar — requires understanding science, not just sentiment
- **Verdict: HIGH VALUE for CRT calibration.** This is essentially an external labeled dataset for what CRT is building. 317 cases with ground truth (text → market reaction). Use as validation set for CRT resolution predictions. Free/open access.
- **Action:** Download dataset when ready to run CRT calibration audit. Compare our HIT/MISS classifications against their labeled outcomes.

## Assessment (2026-04-15)
Most sources are skip/later. **BioTradingArena is the exception** — direct external validation for CRT at zero cost. Binding constraint remains WS4 forward evidence, not data gaps.
