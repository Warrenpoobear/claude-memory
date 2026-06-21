---
name: universe_hygiene_branch_2026_06_21
description: "Branch universe/hygiene-2026-06-21 — 3 commits, corporate-actions + ETF parser; awaiting Step 4B import approval"
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

**Ahead of origin by 2 commits** (77592a35 + feee3efb not yet pushed). Remote is `d9531c7b` (frozen main).

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

## Pending before Step 4B (ETF import)
- [ ] **Step 4B approval**: run `import_etf_csvs.py` → `etf_holdings_complete.json`
- [ ] **universe.json update**: run `add_etf_tickers_to_universe.py`
- [ ] **PR open + review** (gh CLI auth broken — open manually at GitHub)
- [ ] **Merge** (requires branch protection gates + operator approval)

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
