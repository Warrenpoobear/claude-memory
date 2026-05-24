---
name: Massive license — downgrade/pause decision (2026-04-27)
description: Massive monthly license is research-only, not a live-production dependency. Decision: pause Mon-Sat cron after 04-28 gate, downgrade tier before renewal. Two queued task prompts captured.
type: project
originSessionId: 5c6a5e68-077e-42e4-88e5-794e96471906
---
**Verdict (2026-04-27): downgrade/pause, NOT cancel.** Massive is a
research-data entitlement, not a live-production dependency.

**The five decisive facts:**

1. `common/startup_preflight.py:70` — `("MASSIVE_API_KEY", "Massive
   Finance options chain data", False)`. The third arg is `required`;
   `False` means preflight only warns, doesn't block.
2. `run_screen.py` lines 5687-5696 branch on missing creds: emits
   `massive_status="no_credentials"` / `"not_available"` and proceeds.
   Chain analytics warmer (line 5759) and day-aggs ingest (line 5881)
   are gated on `massive_status == "ok"` — silently skipped if absent.
3. `common/options_history_massive.py` self-documents as "Designed for
   historical research and backfills, NOT live ranking."
4. Cached day-aggs current through 2026-04-24 in
   `data/caches/massive_options/day_aggs/`. Mon-Sat 07:00 cron has
   been keeping it fresh.
5. All confirmed consumers are research/diagnostic:
   `tools/biotech_hedge_report.py`, `scripts/research/build_precatalyst_options_panel.py`,
   `scripts/research/build_options_activity_panel.py`,
   `scripts/research/build_historical_iv_surface.py`,
   `scripts/research/build_intraday_options_pressure_panel.py`. None of
   these are in the live selector/ranker path.

**Why:** "Daily ingest is real, but daily ingest is not the same as
production necessity. You are paying to keep an options research
warehouse fresh." The hedge backtest (`tools/biotech_hedge_report.py`)
is the strongest justification for keeping any tier — it materially
improved hedge realism by replacing Black-Scholes-only repricing with
actual option day-closes. PIT options reconstruction is scaffolding,
not yet built.

**How to apply (sequence):**

- **Tonight (2026-04-27):** do nothing. Babysit window through 04-28
  verification gate.
- **2026-04-28 after the gate clears:** deploy task #1 below — pause
  the cron, snapshot crontab, document.
- **Within the same week:** deploy task #2 below — confirm minute_aggs
  / trades are not consumed by any live or scheduled path before
  downgrading tier.
- **At renewal:** downgrade to day-aggs / flat-files tier if Massive
  offers it. Cancel only if no cheaper tier exists AND options
  research is frozen for 30-60 days.

---

## Task #1 — Pause the Massive cron (deploy 2026-04-28 after gate clears)

```
Proceed with Massive cost-control step.

Constraints:
- Do not modify production scoring logic.
- Do not delete cached Massive data.
- Do not delete Massive scripts.
- Do not run external API calls.
- Do not change model/ranker behavior.

Task:
1. Snapshot current crontab to a timestamped file under artifacts/ops/
   or logs/ops/.
2. Comment out only this cron entry:
   0 7 * * 1-6 ... python3 tools/fetch_massive_option_day_aggs.py
   --date $(date -d "yesterday" +%Y-%m-%d)
3. Add an inline crontab comment:
   paused 2026-04-28 pending Massive tier downgrade; safe because
   Massive is research-only and run_screen degrades without creds.
4. Record latest cached Massive day-agg date before pause.
5. Run a grep-only confirmation that run_screen.py and production
   cron do not require Massive.
6. Return a diff-only summary.

Do not change anything else.
```

## Task #2 — Pre-renewal: minute_aggs / trades consumption audit

```
Confirm whether minute_aggs or trades are consumed by any live or
scheduled path.

Read-only only:
- grep for fetch_massive_option_minute_aggs.py
- grep for fetch_massive_option_trades.py
- grep for minute_aggs and option_trades imports/usages
- check crontab and scheduled scripts
- classify each usage as live / scheduled research / dormant

Return:
- live dependency: yes/no
- scheduled dependency: yes/no
- safe to downgrade to day-aggs-only: yes/no
```

## License action decision tree

```
If Massive offers a day-aggs / flat-files-only tier:
    downgrade to that.

If the only cheaper tier loses historical option day-aggs:
    keep one more month only if hedge/PIT-options work is active.

If options research is frozen for 30-60 days:
    pause cron now, keep cache, and cancel at renewal if downgrade is
    unavailable.
```
