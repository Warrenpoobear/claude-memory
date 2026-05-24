---
name: options_alpha_strategy
description: Strategic framework for using options IV/skew as alpha signal in biotech catalyst model — magnitude vs direction split, promotion ladder, within-bucket discriminator
type: project
---

# Options Alpha Strategy

## Core Principle
Options is a **second-stage signal inside catalyst names**, not a standalone global ranker. Restrict to `catalyst_days <= 90` with `opt_use_for_judgment=YES`.

## Magnitude vs Direction Split
- **Term structure** (`opt_term_slope`, `opt_event_premium`): magnitude signal → predicts **absolute gap size** → risk/positioning overlay
- **ATM skew** (`opt_put_call_skew`): directional bias near event → positive = puts richer = fear premium
- **25-delta RR** (`opt_rr_25d`): cleaner directional skew (comparable tail-demand strikes) → best directional alpha candidate

## Decision Rule
- If options only predicts `abs_gap`: **risk overlay** (sizing, not ranking)
- If skew/RR predicts `signed_gap` or `fwd_ret_5d` drift AND survives catalyst-timing control: **alpha candidate** → passive score first → then ruleset A/B
- If nothing survives controls: **abandon**

## Promotion Ladder
1. Raw IC / binned tests
2. Incremental IC after controlling for `catalyst_decay_w`
3. Double-sort spread (within catalyst-timing terciles)
4. Portfolio-realistic top-K slice vs catalyst-only baseline
5. Passive score in rankings
6. Ruleset A/B

## Within-Bucket Discriminator Pattern
- Catalyst stack identifies relevant names first
- Options ranks **within** those names
- Prevents options from merely rediscovering "the event is soon"

## One-Sentence Summary
Use term structure to size respect for the event, and use skew/risk-reversal to choose side within high-conviction catalyst names.

## Infrastructure Status (2026-03-12)
- `eval_options_alpha.py`: research harness committed, runs on synthetic fixtures, awaiting live data
- `opt_term_slope`, `opt_atm_iv`: populated via REST market metrics
- `opt_put_call_skew`, `opt_rr_25d`: populated via DXLinkStreamer (committed daa63e4e)
- `eval_signal_portfolios.py`: opt_term_slope + opt_atm_iv added to SIGNAL_COLUMNS
- Live data accumulation: zero real observations so far (tastytrade credentials activated 2026-03-12)
