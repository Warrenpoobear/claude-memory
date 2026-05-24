---
name: Standing allocation policy
description: 30/70 DEM/XBI initial production, 60/40 scaled target, 100% DEM research only
type: project
originSessionId: 5ba4ffdd-7e02-4b9f-ad61-fe538d3076f8
---
## Standing Allocation Policy (2026-04-17)

**Research/shadow:** 100% DEM Top-30 EW (pure signal benchmark)
**Initial production:** 30% DEM / 70% XBI
**Scaled production target:** 60% DEM / 40% XBI
**Default core:** XBI (not EW-All — better drawdown control)

**Risk control lives at the allocation layer, not inside the model.**

### What stays fixed
- DEM = Top-30 EW, buffer=30, bucket_hysteresis=false
- JBIO excluded. Live starts 2024-10-01.
- Net-of-cost first (50bps base, 25/100bps sensitivity)
- Historical = pseudo-PIT. Live = production/live.

### Standing reporting rule
Always show three series: 100% DEM, 30/70 DEM/XBI, 60/40 DEM/XBI.
Default deployable headline = 30/70 DEM/XBI.

### Promotion from 30/70 to 60/40
Requires: live net excess positive, live Sharpe acceptable, ex-tail robustness,
no recurring failure mode. Do NOT promote on pseudo-PIT alone.

### Do NOT
- Reopen internal overlay blending
- Recommend EW-All as default core
- Recommend position caps in Top-30 EW
- Replace research benchmark with blended wrapper

**Why:** Capital allocation sweep showed alpha scales linearly with DEM weight,
no knee point, XBI core dominates EW-All on drawdown. 30% is conservative start
given 18mo live at t=1.13. 60% is the live Sharpe maximum (1.37).
