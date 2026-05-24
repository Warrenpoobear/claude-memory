---
name: bioshort operational status
description: Bioshort is in governed weekly production — feature freeze until 4-8 weeks of archive history collected
type: project
---

Bioshort entered weekly production mode on 2026-03-18. Feature freeze in effect.

**Why:** Need 4-8 weeks of archived weekly outputs before changing the model or adding features. The archive history is the most valuable next data, not another feature.

**How to apply:**
- Do NOT add new bioshort features unless explicitly asked
- Run weekly, archive every run, let the diff accumulate
- Watch: recommendation stability, carry, source mix, fallback usage, historical coverage
- After sufficient archive history (~late April / May 2026), the right research is a **hedge-timing study** on bioshort states (verdict, confidence, carry, DTE, Greeks) vs portfolio drawdown reduction / hedge P&L efficiency / residual returns
- Do NOT backtest bioshort as a stock-alpha signal — it is a hedge/risk tool, not a name selector
- The repo already has `eval_options_alpha.py` for the alpha question; bioshort serves a different purpose
