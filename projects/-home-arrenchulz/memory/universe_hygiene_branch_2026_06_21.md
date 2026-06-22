---
name: universe_hygiene_branch_2026_06_21
description: "universe/hygiene — PR #365 MERGED to main 2026-06-22 (354-ticker universe now golden @ e304654d); 4 IPO adds (KLRA/PBLS/GENB/KARD → 358) in follow-up DRAFT PR #366, merge-gated"
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-21
  relatedTo: biotech_containment_governance_2026_06_21
  originSessionId: ec7a4958-2a85-44e3-bb58-cf66e6fa3931
---

# Universe Hygiene Branch — 2026-06-21

## Branch: `universe/hygiene-2026-06-21`

**STEP 4B COMPLETE (verified 2026-06-21).** HEAD = `ed032c8a`, local == origin (pushed). All 4 commits in. Working tree clean. Remaining: PR open + merge only (gh auth broken → open manually at GitHub; merge gated by containment gates + operator approval).

Earlier state: ahead of origin by 2 commits (77592a35 + feee3efb). Remote main is `d9531c7b` (frozen).

## Committed

| Hash | Commit | What |
|------|--------|------|
| `6a7c702e` | fix(universe): mark RNA APLS KALV acquisitions in corporate actions | RNA=Novartis/2026-02-27, APLS=Biogen/2026-05-14, KALV=Chiesi/2026-06-11 |
| `77592a35` | fix(universe): add TERN and THRD to corporate actions registry | TERN=Merck/2026-05-05 (NOT Roche), THRD=delisted/2025-07-31 (liquidation, NOT Roche acquisition) |
| `feee3efb` | fix(universe): harden ETF CSV ticker parsing | Exact header-row detection, `^[A-Z]{1,5}(-[A-Z])?$` regex, PURR+LLC exclusions |

**Why:** `production_data/corporate_actions.json` was stale — RNA/APLS/KALV were appearing as live candidates in universe runs despite closed acquisitions. ETF parser was picking up metadata rows (`Ticker Symbol:,XBI`), SEDOL IDs (`2200963D`), and non-biotech entries (PURR=Hyperliquid Strategies, LLC=State Street footer text).

## Working tree — clean
No uncommitted changes after `feee3efb`. `universe.json` unchanged. `etf_holdings_complete.json` unchanged.

## ETF files (gitignored, not tracked)
- `etf_csvs/XBI_holdings.csv` — SSGA direct download, Jun 17 2026, **142 tickers** (after PURR/LLC/SEDOL filter)
- `etf_csvs/IBB_holdings.csv` — **RECONSTRUCTED** from SEC EDGAR NPORT-P filing
  - Accession: `0002071691-26-012466` | Period: 2026-03-31 | Filed: 2026-05-28
  - CIK: 0001100663 (iShares Trust), Series: S000004350 (iShares Biotechnology ETF)
  - 242 tickers; 13 entries skipped (5 CVRs, 4 N/A/money-market, 4 uncertain/foreign)
  - CUSIP→ticker via `production_data/cusip_static_map.json` (215 resolved) + manual name map (27 resolved)
  - iShares API broken (returns HTML); NPORT-P is the durable fallback source

## corporate_actions.json now 61 entries (was 57)

## Status
- [x] **Step 4B**: `import_etf_csvs.py` → `etf_holdings_complete.json` (ibb/nbi/xbi keys) — DONE
- [x] **universe.json update**: commit `ed032c8a` added 16 ETF tickers. `production_data/universe.json` = 354 tickers, valid JSON, all 16 adds present. Backup at `production_data/universe_backup_2026-06-21.json` (gitignored, 1.3MB).
- [x] **corporate_actions.json** = 61 entries in `actions` list (schema-wrapped dict).
- [x] **PR #365 MERGED** — merged to `main` 2026-06-22 14:37 at commit `ed032c8a` (354 tickers); `main` now `e304654d`. **The 354-ticker hygiene universe (corp-actions + ETF parser + 16 ETF adds) IS now the golden record on main.** Branch auto-deleted on merge, then re-created by my push.
- [x] **IPO completeness adds** — 4 verified H1 2026 biotech IPOs (KLRA/PBLS/GENB/KARD) committed `5e068773` → 358 tickers. Did NOT make #365 (pushed after merge); now in **follow-up DRAFT PR [#366](https://github.com/Warrenpoobear/biotech-screener/pull/366)** (base `main`, clean +76 diff). NOT yet on main / NOT golden.
- [ ] **Merge #366** — gated by no-CI (Actions budget exhausted) + containment. Until merged, golden universe on main = 354 (KLRA/PBLS absent).

The 16 adds: live (11) ABBV AKBA CAPR CPRX DMRA IMNM MDXG RNAC SLS TRAX VSTM; pre-gated by corp actions (5) ACLX DAWN FOLD TERN THRD — added for completeness, excluded by `is_dead()` (common/corporate_actions.py) at run time so no false-positive candidates.

## Eligibility validation (2026-06-22, read-only, on branch HEAD ed032c8a)
`is_dead`-gating as of 2026-06-22: **354 entries → 343 ELIGIBLE, 11 gated**, no duplicates, all symbols well-formed.
- Gated (all verified acquisition/delisted): ACLX, APLS, BHVN, CNTA, DAWN, FOLD, IMVT, KALV, RNA, TERN, THRD.
- ✅ All 8 hygiene-targeted dead tickers (RNA/APLS/KALV/TERN/THRD/ACLX/DAWN/FOLD) present-but-gated as intended.
- ✅ All 11 live adds (ABBV/AKBA/CAPR/CPRX/DMRA/IMNM/MDXG/RNAC/SLS/TRAX/VSTM) present + eligible.
- ⚠️ BHVN (2024-10-15) + IMVT (2024-02-12) are old dead entries kept-and-gated — consistent with the keep+gate convention, NOT a bug; removing only these two would be inconsistent. Leave unless the whole convention changes.
- ⚠️ 4 audit IPO adds still MISSING: KLRA, PBLS, GENB, KARD (completeness gap; NOT addressed by this branch).
- NOTE: validates `is_dead` gating only — NOT downstream financial/market-cap/data-availability eligibility filters (needs a real pipeline run, blocked by no-CI/containment).

## Known universe gaps (would be added by Step 4B)
~10 live new biotech adds: CAPR, CPRX, IMNM, SLS, AKBA, VSTM, MDXG, DMRA, TRAX, RNAC
3 pre-gated by corp actions: ACLX (Gilead/2025-12-15), DAWN (Unknown/2026-03-15), FOLD (Unknown/2026-03-01)
TERN + THRD now also gated ✓

## Governance constraints (unchanged)
- No ranker/selector/scoring changes
- No direct push to main
- Every step operator-approved before execution
- Crons paused
- Live book: HOLD all 15, zero orders
