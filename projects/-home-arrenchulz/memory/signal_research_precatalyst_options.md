---
name: signal_research_precatalyst_options
description: Pre-catalyst options crowding research — contra-indicator, orthogonal to clinical quality, but unstable
type: project
---

Pre-catalyst options activity features tested 2026-03-12 using Massive day-agg history.
Orthogonality analysis against clinical_quality_composite completed same day.

**Finding:** Volume, chain breadth, and transaction count are NEGATIVE predictors of forward returns (crowding effect). The signal is ORTHOGONAL to clinical quality (partial IC ≈ marginal IC) but temporally UNSTABLE (50% sign consistency across snapshots).

**Why:** Heavily traded options chains reflect crowded positioning — expected move already priced in. This is independent of clinical trial quality.

**Positive-discriminator hypothesis: ARCHIVED.** Activity does not predict better names.

**Crowding penalty hypothesis: PLAUSIBLE but TOO EARLY to promote.**

**IC results (Spearman rho vs forward returns, n=789-812):**
- Overall (5d): volume_mean -0.045, chain_breadth -0.078, transactions -0.079, contract_count -0.085
- Overall (20d): weaker across the board (-0.01 to -0.08)
- Best bucket: `less_binary` — chain_breadth -0.16, contract_count -0.16, transactions -0.15 at 5d
- `binary_now`: moderate (-0.05 to -0.11 at 5d)
- `build_window`: DEAD — zero IC, drop from research
- Event type: CT_STUDY_COMPLETION stronger (-0.12 to -0.14), DATA_READOUT -0.35 but n=19
- volume_surge, volume_trend: noise (inconsistent sign)

**Orthogonality (partial IC controlling for clinical_quality_composite):**
- Partial IC ≈ marginal IC for all features → crowding is NOT a proxy for clinical quality
- The two signals measure different things; crowding adds independent (weak) info

**Temporal stability: POOR**
- volume_mean 5d: negative in 50% of 6 snapshots, mean rho -0.018
- Not robust enough for promotion; need 4-6 more months of history

**How to apply:**
- Do NOT promote crowding penalty to DEM yet — unstable, weak magnitude
- Best candidates for future revisit: chain_breadth + contract_count in less_binary (5d)
- Drop build_window from further options crowding research
- Keep evaluating options_quality_composite (chain-quality track) separately — different signal family
- REGULATORY still has insufficient population (1 event in archives)
- Revisit after accumulating ~20+ snapshot dates with Massive coverage

**Data artifacts:**
- Panel: `data/research/precatalyst_options_panel_clinical.csv` (815 rows)
- Enriched panel: `data/research/crowding_orthogonality_panel.csv` (815 rows, with clinical quality + fwd returns)
- Report: `data/research/crowding_orthogonality_report.txt`
- Scripts: `scripts/research/build_precatalyst_options_panel.py`, `scripts/research/crowding_orthogonality_analysis.py`
