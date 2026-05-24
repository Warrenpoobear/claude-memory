---
name: SEC 8-K Catalyst Coverage Diagnosis (2026-04-28)
description: Phase 0+1 audit of cache/sec/8k_catalysts. 82-vs-387 was unit confusion. Real gaps are 6-K coverage, accession dedupe, Exhibit 99.1 retention. Phase 2 producer rebuild proposed but NOT authorized.
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
Phase 0+1 read-only audit of SEC 8-K catalyst cache. Artifacts:
`artifacts/sec_8k/sec_coverage_diagnosis_2026-04-28.{md,json}`,
`artifacts/sec_8k/ticker_cik_map_2026-04-28.json` (336 ticker→CIK pairs).

**Why:** User asked to improve SEC catalyst coverage as a separate producer-quality project (not a Spec 068 dependency). Spec 068 currently loads no `cache/sec/8k_catalysts` input, so SEC coverage is not a blocker for the development-stage audit.

**How to apply:** Before proposing any SEC fix, re-read the artifact. Do not start a new online scraper — fix the existing producer in three layers (discovery, parsing, classification). Phase 2 producer rebuild is *design-only* until explicitly authorized.

Key findings (durable):

- **82-vs-387 = file-count vs event-count confusion.** 82 real top-level files in `cache/sec/8k_catalysts/`; each is a PIT list of all current+upcoming catalysts. 2026-04-27 snapshot has 387 events, 2026-04-28 has 357. Across 82 snapshots: 27,130 records but only 4,276 unique `(ticker, disclosed_at, event_name)` signatures (~22.8k duplicates from same event reappearing across snapshots).
- **Active cache schema is post-classification only.** 10 fields per record (`ticker, event_type, event_date, event_date_end, date_precision, event_name, confidence, source, disclosed_at, tags`). No `accession_number`, no `form`, no `item_numbers`, no `exhibit_urls`, no `cik`, no `source_sha256`. **Accession-level dedupe is not possible in the active cache.**
- **8-K only.** Active path has zero `filing_form` field. 6-K filers (TEVA, AZN, BNTX, ARGX, ASND, ABVX, ABCL, ACIU, ACLX, ADMA, ADPT, BIOA, CRL, …) are silently excluded.
- **Event taxonomy collapses.** Only emits DATA_READOUT, FDA_PDUFA_DATE, SAFETY_SIGNAL, CLINICAL_HOLD, FDA_CRL, FDA_RTF, FDA_ADCOM, FDA_WARNING_LETTER. Financing / BD / governance / earnings have no bucket — dropped, not classified `non_catalyst`. QA cannot distinguish "we read it and it wasn't a catalyst" from "we never saw it."
- **Three universe-hash buckets coexist** in the active cache: `b2bdaf75` (62 files), `249a4353` (18), `937b38db` (2; cutover started 2026-04-27). Cross-snapshot comparisons need explicit handling.
- **Six abandoned `.staging_8k_*` dirs** (mtime 2026-03-05 → 2026-03-25), all empty. Housekeeping debt.
- **Second cache at `wake_robin_data_pipeline/cache/sec/8k_catalysts/`**: 25 stale snapshot files (newest 2026-02-14) + `multi_form_parsed/` subdir with **1,692 accession-keyed files**. Yield = **5.9%** (1,592 of 1,692 contain zero classified records). Has `filing_form` field — 6-K (123), 10-Q (20), 10-K/A (2), 6-K/A (1), 10-K (1). Useful as starting point for Phase 2 cache shape; NOT production data.
- **CIK coverage = 98.2%.** 336/342 universe tickers have valid CIK. 5 real holes: `CNTX, DFTX, KYNB, SRZN, TEVA` (`_XBI_BENCHMARK_` is a sentinel, not a filer). TEVA has public CIK 0000818686 but files 6-K — its absence is mostly a 6-K coverage problem.
- **77 universe tickers have CIK but zero events in active cache.** This — not CIK gaps — is the main coverage hole. Adding 6-K to the active path is the single highest-yield fix.

Phase 2 producer design (proposed, not built): submissions API as canonical path, daily-index fallback, Exhibit 99.1 fetch+retain, accession-keyed raw cache, conservative classifier with `non_catalyst` bucket, ≤1–3 req/s, daily QA report. See artifact md for full spec + build order.
