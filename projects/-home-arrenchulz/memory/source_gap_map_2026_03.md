---
name: Source gap map March 2026
description: Inventory of what data sources are live in DEM vs research-only vs not built — guides new signal work priorities
type: project
---

## Source Status (as of 2026-03-19)

### Already live in DEM ranking
- CTGov trials (PCD/CD events)
- Merged trial registries (EUCTR, CTIS, ISRCTN)
- SEC 8-K (always-on catalyst source)
- SEC multi-form (10-Q, 10-K, 6-K)
- FDA AdCom calendar
- FDA regulatory notices (Federal Register)
- PDUFA manual dates
- SEC 13F / coinvest features (PIT-safe)
- Clinical phase/design/endpoint modeling (v3 priors)
- Calendar alpha (w=0.3, frozen)

### Research-only / not wired into DEM
1. **Options activity / crowding panel** — Massive provider + builder exist, explicitly "NOT wired into the decision engine." Clearest new-source candidate.
2. **IR events / press release history** — backfill tooling and caches exist, but absent from live event-ledger source list. Infrastructure ready, not yet a core live catalyst source.
3. **PI / investigator-network features** — no evidence this is live in DEM. Trial-registry clinical work is present but not PI-network data. Genuinely new source.

### Partially live / incomplete
4. **Manual regulatory calendar** — live and PIT-safe, but narrower than possible. Some records still need company IR verification for exact dates. Expanding/verifying would broaden forward regulatory coverage.

### Not good candidates (already absorbed)
- SEC 8-K: always-on in event ledger
- EU/EEA registries: EUCTR, CTIS, ISRCTN in cache/event stack
- 13F / smart money: PIT-safe coinvest features live
- Macro / regime: framework exists but screener explicitly not designed for macro timing

**Why:** Knowing what's live vs research-only prevents wasting effort on sources already absorbed and focuses new signal work on genuinely unused information.

**How to apply:** When choosing next signal-source work, pick from the "research-only / not wired" list. One at a time, through governance path. Options activity panel is the clearest candidate given infrastructure already exists.
