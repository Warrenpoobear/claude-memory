---
name: Spec 063 news-enrichment layer is a phantom — never wired (2026-04-20)
description: The same-day news lookup in the intraday mover watch reads from directories no code path produces. Every `news_status` has been `"NONE"` since go-live. Not a post-cutover regression.
type: project
originSessionId: 92861731-bf1b-4e00-a354-806d66aabb2e
---
`tools/build_intraday_mover_watch.py:245-263` (`lookup_same_day_news`) reads
from three directories in priority order:

- `artifacts/herald/classified/{as_of_date}.json`
- `artifacts/herald/raw/{as_of_date}.json`
- `artifacts/grok_biotech_watch/{as_of_date}_watch.json`

**None of these directories exist.** Grep of the repo shows no code path
writes to `artifacts/herald/classified/` or `artifacts/herald/raw/`. The only
"herald" writer is `tools/herald_crt_intake.py`, which writes to
`artifacts/herald_crt_intake/` (different dir, different purpose — CRT
candidate feed, not same-day enrichment). Grok watch has never been
populated either.

The scaffolding admits it at line 242–244:

> "Scaffolding-level implementation: scans JSON files by date. Production
> path should use indexed lookups; Phase 2 will optimize."

Phase 2 defined the interface and stubbed the reader, but no producer was
ever built.

## Consequence

Every `lookup_same_day_news()` call falls through all three branches to
`_null_news_record()` at line 263 → `news_status="NONE"` → trigger code
`INTRADAY_MOVE_NO_OFFICIAL_NEWS` → email subjects get the fallback string
"no official same-day source found".

## Verified on both sides of classifier cutover

- 2026-04-17 post-close poll (n=11): all `news_status="NONE"` (pre-cutover)
- 2026-04-20 intraday polls (n=6 at peak): all `news_status="NONE"` (post-cutover)

**This is not a regression from the CH-1..CH-7 classifier hardening** (see
`classifier_hardening_2026_04_19.md`). The classifier writes to
`data/press_releases/classified/classified_YYYY-MM-DD.jsonl`, which has both
a different path and a different on-disk shape (JSONL, no `{"releases": [...]}`
wrapper) from what the mover-watch reads.

## How to apply

- If a future session reports "Spec 063 news tags went missing after the
  classifier cutover" or "enrichment broke" — it did not break, it was
  never wired. Reference this memory.
- The core Spec 063 pipeline (polling, severity, dedupe, email send) works
  correctly. Only the enrichment lane is dead.
- Connecting it up is a code change beyond attribution and is outside the
  current architecture freeze. Do not propose a fix without explicit user
  direction.
- Unrelated but noted: `tools/cron_intraday_mover.sh` builds `AS_OF_TS` by
  concatenating `ET_DATE + "T" + UTC_TIME + "Z"`, which creates filenames
  that don't correspond to real timestamps when ET and UTC days differ
  (e.g. an 04-17 23:26 ET poll was written as `2026-04-17T03:26:04Z`, which
  is actually 04-18 UTC). Not a fix-now item; flag if it affects file-order
  assumptions in future reads.
