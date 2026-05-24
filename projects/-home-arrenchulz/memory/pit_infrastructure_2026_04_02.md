---
name: PIT Infrastructure & Financial Correction
description: PIT remediation complete — historical alpha collapsed after financial look-ahead correction; forward monitor is only credible evidence
type: project
---

## PIT Remediation (Spec 048, COMPLETE 2026-04-02)

### The finding

After correcting PIT financial leakage, historical selector performance materially deteriorates.
Prior alpha was inflated by financial look-ahead contamination.

| Metric | Survivorship-only (DEPRECATED) | PIT-Financial-Corrected (FINAL) |
|--------|-------------------------------|--------------------------------|
| EW Top-20 excess vs XBI | +93.7pp | **-28.2pp** |
| EW Top-30 excess vs XBI | +110.5pp | **-25.1pp** |
| Monthly excess (63d) | +4.27pp/mo, t=3.20 | **+0.58pp/mo, t=0.65** |
| Hit rate vs XBI | 67% | **52%** |
| Bear IR | -0.06 | **0.00** |
| Bull IR | +0.79 | **+0.15** |

### What happened

PIT financial regeneration (76 monthly dates, `data/snapshots_pit_v2/`) replaced current-state
financials with EDGAR filing-date-gated facts. On a sample date, only 12/30 top-30 names
overlapped between original and corrected rankings. 67.8% of top-30 had >25% cash delta.
The correction reshuffled rankings severely enough to eliminate cumulative excess.

### Operational status

- All phases complete (0-4 + PIT financial regeneration)
- 72/72 monthly dates regenerated successfully in ~107 min
- All pre-correction benchmark claims are DEPRECATED
- Forward true-PIT monitor is the only credible evidence source
- Governance hold succeeded — prevented false positive from being institutionalized

### Infrastructure built

1. `pit_financials.py` — EDGAR XBRL filing-date gating
2. `tools/build_pit_financials.py` — 339 tickers downloaded
3. `scripts/research/regenerate_pit_v2_snapshots.py` — batch regeneration
4. `tools/pit_audit_artifacts.py` — survivorship + financials audits
5. `tools/pit_label_benchmarks.py` — v1/v2 artifact labeling
6. All benchmark scripts wired with `--pit-mode` and `--snapshot-dir`
7. `pseudo_pit_version` in snapshot metadata

**Why:** Historical backtest numbers were cited as evidence but were contaminated by financial look-ahead bias.

**How to apply:** Never cite historical alpha numbers. Use forward monitor results only. The selector may still work — but there is no historical evidence to prove it after correction. Only time under true PIT will tell.
