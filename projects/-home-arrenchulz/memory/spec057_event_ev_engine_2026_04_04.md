---
name: Spec 057 Event EV Engine
description: Bayesian biotech event EV engine — six-layer architecture for timing, outcome, expectation, payoff modeling of catalysts
type: project
---

## Spec 057 — Bayesian Biotech Event EV Engine (2026-04-04)

**Status:** RESEARCH SCAFFOLD COMPLETE. Not production. 50/50 tests passing.

### Architecture
Six layers in `event_ev/` package:
1. **Catalyst Graph** (`catalyst_graph.py`) — 4,256 unified event objects from ledger + PDUFA + CRT
2. **Timing Hazard** (`timing_hazard.py`) — logistic model, trainable, PIT-safe
3. **Outcome Model** (`outcome_model.py`) — Bayesian prior-posterior (Wong et al. + v2), calibration eval
4. **Expectation Model** (`expectation_model.py`) — cross-sectional belief proxy (coinvest/inst_delta/insider/alpha)
5. **Payoff Engine** (`payoff_engine.py`) — analog-based scenario EV with market cap/vol adjustments
6. **Portfolio Translator** (`portfolio_translator.py`) — four sizing modes, risk constraints

**Orchestrator:** `ev_calculator.py` — full pipeline, JSON output, summary tables
**Eval harness:** `scripts/research/run_event_ev_study.py` — single-date, backtest, scenario modes
**Tests:** `tests/test_event_ev_engine.py` — 50 tests (all layers + PIT safety + probability constraints)

### First live run (2026-04-04)
- 4,256 nodes, 153 in 0-180d window, 12 actionable (all PDUFA)
- Top EV = +4.65%, mean EV = -18.16% (most events are negative EV — correct)
- Expectation layer starved (0 market features loaded — snapshot CSV parsing needs fix)
- CRT: 30 resolutions applied (too few for calibration)

### Key findings
- **Timing layer has best data** (4,254 ledger entries) and is most likely to show value first
- **Outcome model needs CRT growth** — 30 resolutions insufficient, need 50+ for calibration
- **First pilot should be timing hazard flag on dashboard** — no production changes required

### Data quirks
- PDUFA file uses `pdufa_date` not `date`, `as_of_disclosed_at` not `disclosed_at`
- Event ledger uses `pit_available_at` not `disclosed_at`
- Resolution files are individual dicts (one per file), not lists
- `catalyst_events_*.json` summaries have empty event lists — events are in the ledger

### Next steps
- Wire market features (fix snapshot CSV field matching)
- Build labeled timing dataset from ledger revision history
- Train timing model on historical slips vs on-time
- 30-day timing flag accumulation → evaluate discrimination
