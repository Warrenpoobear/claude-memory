---
name: Spec 063 Intraday Mover Watch
description: Canonical spec and provider policy for the intraday mover alert agent; code gated on Polygon credentials
type: project
originSessionId: cd99217c-fc0a-4893-991d-c9c11c664416
---
Canonical spec for intraday mover alerts is `specs/changes/spec_063_intraday_mover_watch.md`.

**Status**: Phase 1 + 1.5 + 2 + 3 code complete as of 2026-04-17. Alpaca paper keys in `.env`, fixture tests passing. Phase 2 wired `common/alert_email.py` (shared SMTP helper) + immediate HIGH alerts + EOD digest send. Send is triple-gated: `--send-email` + `health.mode == "live"` + `is_smtp_configured()`. Every body stamps `Feed source:` and `News status:`.

**Phase 3 additions**:
- `common/alert_dedupe.py` — persistent on-disk dedupe at `artifacts/intraday_mover_watch/sent_alerts.json`. Spec 063 rules: 4h window, re-send on severity/news step-up (via dedupe_key change) or ≥3pp move widening, prunes entries older than 7 days.
- `tools/cron_intraday_mover.sh` — standard cron wrapper (not OpenClaw fleet — that's a separate mechanism in this repo). Uses ET trading date for `as_of_ts` to survive cross-midnight runs. Lockfile prevents overlap.
- Crontab entries **registered 2026-04-17** (Friday evening; first fire Monday 2026-04-20 09:35 ET): 2 open-window polls, 12 core polls (30-min cadence), 1 EOD digest. All with `--send-email` on. Upgrade to 15-min core cadence after one clean week.
- Cron smoke test passed 2026-04-17 23:26 ET (temp entry fired correctly, `.env` loaded under cron restricted env, Alpaca creds resolved, 11 movers triggered after-hours with `--no-email`).

**125 tests pass.** **No real email has been sent yet.** First live send will happen Monday 2026-04-20 09:35 ET (if any HIGH mover triggers). Operator should watch `logs/intraday_mover.log` during week 1 and confirm the first few emails render cleanly before upgrading to 15-min core cadence.

**Provider strategy** (user does NOT have a Polygon license; no separate exchange-license subscription needed):
- **Primary**: Alpaca Basic (free plan). 15-min delayed REST snapshots via `GET /v2/stocks/snapshots`. Env: `APCA_API_KEY_ID` + `APCA_API_SECRET_KEY`.
- **Optional paid upgrade**: Polygon/Massive (same vendor in this repo) via `MASSIVE_API_KEY`/`POLYGON_API_KEY`. Factory picks Alpaca first when both are set.
- **Dev only**: yfinance via `BIOTECH_INTRADAY_DEV_FALLBACK=1`. Never production primary.
- **Rejected**: Finnhub and Alpha Vantage free tiers — licensing/entitlement unclear.

**Factory order**: Alpaca → Polygon/Massive → yfinance dev fallback → NullQuoteClient. `BIOTECH_INTRADAY_REALTIME_TIER=1` is a **legacy gate for the Polygon path only**; not needed for Alpaca.

**Phase 1.5 — required before Phase 2 (SMTP/email wiring)**:
1. Sign up at alpaca.markets; generate API key (paper keys work — this agent never trades).
2. Capture real Alpaca snapshot fixtures: one biotech ticker, one XBI, one missing/illiquid case. Freeze as test fixtures.
3. Add fixture-backed integration test validating actual parsed fields (last, prev_close, open/high/low, volume, timestamp).
4. Run one credentialed dry-run during market hours with email off; verify artifact shape and XBI relative math.

**Feed provenance (added during Alpaca migration)**: every poll artifact carries `feed_source` + `feed_detail` at the header, and each row carries `source` + `xbi_source`. Alert emails must include the feed label when Phase 2 wires SMTP.

**Deferred cleanup**: rename `BIOTECH_INTRADAY_REALTIME_TIER` to something Polygon-path-specific (e.g., `BIOTECH_POLYGON_REALTIME_TIER`) once/if the Polygon path actually activates. Currently a legacy gate with no live dependency.

**Do not** let `DevFallbackQuoteClient` (yfinance) become sticky. Post-fixture-capture, serious validation runs use Alpaca or `NullQuoteClient`.

**Read-only invariants** — no scoring, ranking, event-ledger, trade-plan, or `production_data/` writes. No cron registration until Phase 3 (Phase 2 must pass 1-2 manual market-hours runs first).

**How to apply**: when user asks about intraday alerts, Alpaca/Polygon wiring, or real-time quote access, this file is the source of truth. Alpaca is the default path; only go down the Polygon/Massive path if the user explicitly says they've acquired a paid feed.
