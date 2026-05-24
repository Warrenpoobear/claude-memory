---
name: Report both screening and portfolio catalyst fields
description: When reporting a ticker's catalyst/bucket, always show both the screening primary event and the portfolio effective event to prevent false discrepancy
type: feedback
---

When reporting a ticker's catalyst classification, always show both layers explicitly:
- **screening_primary_event**: catalyst_days, catalyst_bucket, catalyst_family (from rankings.csv)
- **portfolio_effective_event**: bucket, effective_family, regulatory_days (from positions JSON)

**Why:** Rankings and portfolio construction use different catalyst selection logic. Rankings picks the CTgov primary completion date; portfolio construction may promote a nearer regulatory event. Reporting from one layer in one place and the other layer elsewhere creates an apparent inconsistency that isn't real. This happened with KOD on 2026-03-27 (rankings: 127d/less_binary/CLINICAL vs positions: binary_91_180/REGULATORY/96d regulatory).

**How to apply:** Any time I pull catalyst/bucket/family info for a ticker, fetch from both rankings.csv AND the positions artifact, and present both. If they differ, note the reason (e.g. "portfolio promotes PDUFA at 96d over clinical PCD at 127d").
