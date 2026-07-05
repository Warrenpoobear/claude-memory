---
name: reference-morningstar-direct-returns-workflow
description: How to pull per-security trailing total returns (1Mo–10Yr) from Morningstar Direct via morningstar_data SDK
metadata: 
  node_type: memory
  type: reference
  originSessionId: b6fe5d72-eb42-40b9-8ff8-4167e513260a
---

Pull trailing total returns (1Mo/3Mo/YTD/1Yr + annualized 3/5/10Yr) for any security from Morningstar Direct — used to populate a portfolio performance table.

- SDK `morningstar_data` v1.13.0 in `C:\Projects\morningstar`; needs `MD_AUTH_TOKEN` (~24h TTL, hardcode into script — env export doesn't reach the Bash subprocess). See [[reference_morningstar_benchmark]].
- Resolve ticker→SecId: `md.direct.investments(keyword="MU", count=6)` → pick row with `Country=USA`, `Base Currency=USD`, `Security Type ST/FE`. Foreign-only names (China Mobile 941:HK) return local-currency (HKD) rows only.
- Trailing returns dataset = **`0218-0037` "Returns (Month-End)"**: `md.direct.get_investment_data(investments=[secids], data_points="0218-0037")`. Columns: `Total Ret 1 Mo/3 Mo/YTD/1 Yr (Mo-End)`, `Total Ret Annlzd 3/5/10 Yr (Mo-End)`, plus `Return Date (Mo-End)` (defaults to latest month-end). Matches Morningstar's standard convention exactly (verified: IVV ties to S&P 500 to 2 dp).
- Subtotals/totals in these institutional reports = **market-value-weighted, coverage-adjusted** (a holding contributes to a column only where it has data; denominator = MV of holdings-with-data). Reproduces source subtotals exactly.
- No MD return series for: warrants (OXYWS), cash sweeps (FCASH), uncovered OTC micro-caps. New spinoffs/listings (Qnity Q, Magnum MICC, Kyivstar KYIV) have only short-window returns.
