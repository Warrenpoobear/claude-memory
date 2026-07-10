---
name: project_campfimfo_waco_demand_monitor_2026_07_10
description: Wake Robin invests in Camp Fimfo Waco; how to pull its booking availability directly (Campspot API) to gauge demand
metadata: 
  node_type: memory
  type: project
  originSessionId: fb30fe6b-06d9-495e-a2b8-1a4cc293707f
---

Wake Robin has an investment in **Camp Fimfo Waco** (an RV/cabin resort). Goal: gauge forward summer demand by pulling open reservations.

**Booking infra discovered 2026-07-10:** `book.campfimfo.com` is a Next.js skin over **Campspot**. Availability is NOT in page HTML (client-fetched; server renders "0 Campsites Available" placeholder). Direct `api.campspot.com` = 403 (server-held key). Real endpoint found by running headless Playwright once to watch the network call:

- **`https://cs-book.blockcms.build/parks/{parkId}/search?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&children=0&adults=2&pets=0&useCustomParkData=false`** — plain GET, **no auth**, ~330KB JSON.
- Park IDs: **Waco = 2264**, **Texas Hill Country = 55** (older/larger sister park, good control).
- Response `data[]` = site categories. Per category: `name`, `campsiteCategoryCode` (lodging/rv/tent), `availability` (AVAILABLE/UNAVAILABLE), `campsites[]` (only AVAILABLE sites listed → count them for open-site count), `averagePricePerNight`, `averagePricePerNightWithoutDiscounts` (discount tell when > avg), `totalTripPrice`. Labor Day 2-night search returns empty = min-stay enforcement.
- Total inventory proxy (deep off-season Dec midweek): Waco ≈281 sites, Hill Country ≈449 → occupancy% = (base − open)/base.

**MONITORING TOOL (built 2026-07-10):** `/mnt/c/Projects/research/campfimfo-monitor/` (subfolder of git repo rooted at `/mnt/c/Projects/research/` = C:\Projects\research, `core.fileMode false`; pushed to **private GitHub `Warrenpoobear/research`** via ssh, gh account Warrenpoobear) — `waco_monitor.py` (pull both parks → append `waco_demand_history.csv` idempotent per day → regenerate `waco_demand_report.html`) + `report_template.py` (HTML template; literal `/*__PAYLOAD__*/ null` replaced with JSON). **Weekly WSL cron installed**: `0 17 * * 1` (Mon 5pm ET, inside uptime window) runs it → `monitor.log`. Report has dynamic verdict + pace-over-time small-multiples that fill in as observations accumulate (needs ≥2 runs). ⚠️ `nights` type-coercion bug fixed (fresh rows int vs CSV str → `idx` keys str-coerced). **Shared report:** claude.ai artifact `https://claude.ai/code/artifact/9b408506-67cf-4509-900a-a2a01013044a` — user chose **local-cron + I-republish-on-demand** (NO cloud routine: cloud can't see local history). Republish by publishing `~/campfimfo-monitor/waco_demand_report.html` with `url=` that artifact URL. Original ad-hoc collector still at `~/.firecrawl/pull_demand.py`; network-capture `~/.firecrawl/collect.mjs` (uses global `@playwright/test/node_modules/playwright/index.mjs` — ESM needs absolute import path; browsers cached `~/.cache/ms-playwright`).

**First snapshot 2026-07-10 finding:** Waco pacing well BEHIND sister park on near-in summer weekends — this weekend 47% booked vs Hill Country 98% (sold out); gap −51/−33/−19 pts for Jul 10/17/24, collapsing to ~0 by mid-Aug (normal lead time). BUT no discounting anywhere + Waco rates rise into peak ($130→$329) → not distress-pricing; Waco is newer (park 2264 vs 55) so some lag = brand-ramp. Availability ≠ true occupancy (owner blocks/holds not visible). Value is in **pace over time** — re-run weekly to see the booking curve, not one frame.

Note: Firecrawl account was at 0 credits (resets 2026-07-27), which is why the direct-API route mattered. Related: [[feedback_dem_focus_no_robinhood]].
