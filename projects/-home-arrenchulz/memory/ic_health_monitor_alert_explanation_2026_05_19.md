---
name: ic_health_monitor_alert_explanation
description: "inst_delta_z + score_rank_pct ALERT is lagging historical IC, not ingest failure"
metadata: 
  node_type: memory
  type: project
  status: monitoring
  expires: 2026-05-23
  originSessionId: f4dc98ee-62dd-4417-a691-d33d6d3e0320
---

## IC Health Monitor ALERT — Not a System Failure

**Date**: 2026-05-19
**Status**: Lagging historical IC measurement, not an ingest problem

### Facts Verified

1. **13F Ingest**: ✓ CONFIRMED FRESH
   - `production_data/institutional_summary.json` modified 2026-05-19 13:03
   - 42 elite managers with filings as of May 19
   - Data actively flows into `inst_score_z` calculation

2. **IC Dashboard Window**: 2026-03-04 → 2026-05-18 (60-day lookback)
   - Historical IC averaged over 60 days includes negative period (mid-Mar through early Apr)
   - `inst_delta_z` mean IC = -0.0766 (60d), latest IC = -0.0027 (recovering)
   - `score_rank_pct` mean IC = -0.0342 (60d), latest IC = -0.0935 (still negative)

### Why ALERT Persists Despite Fresh Data

The IC dashboard measures **historical predictive power**, not data freshness. Fresh 13F ingest doesn't retroactively improve past IC; it only affects **forward** IC starting May 20.

- Late March through early April: inst_delta had strong negative IC (-0.12 to -0.19)
- Late April onwards: recovery visible (inst_delta -0.0027 as of 05-17)
- 60-day mean includes both periods → still ALERT

### Real Test: May 20–22 (Post–13F Refresh)

**Trigger**: May 20 ~4:30 PM ET — 13F refresh runs, generates new institutional_summary.json with latest filings

**Expected Outcome**: May 20–22 IC dashboard updates will show whether fresh 13F data improves forward prediction
- If inst_delta_z IC > 0 after May 20: ALERT should clear → signal is working
- If inst_delta_z IC remains negative: signal genuinely degraded → escalate

**Monitoring**: Check `artifacts/ic_dashboard/2026-05-2X_dashboard.md` post-refresh

### Conclusion

This is **expected behavior**, not a bug. The 13F ingest is healthy and current. The ALERT is a lagging indicator of past performance. The system will self-correct post-May-20 if fresh institutional data improves prediction.

**Action**: Remove from "broken" category. Categorize as "monitoring for May 20–22 post-refresh recovery."
