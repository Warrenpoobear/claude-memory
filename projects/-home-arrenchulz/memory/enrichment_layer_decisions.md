---
name: Enrichment layer decisions (2026-03-28)
description: PEV architecture approved; competitive_intel swap DONE; indication_master expanded 50→1568; Open Targets fixed 0→218 tickers
type: project
---

**program_entity_view join layer**: APPROVED and LIVE. Ticker x canonical drug x normalized indication keying. drug_match_confidence / disease_match_confidence fields keep low-confidence joins visible.

**competitive_intel swap**: DONE (2026-03-27). `competitive_intensity_engine.build_landscape()` accepts optional `enrichment_dir`. When PEV exists with >=10% indication coverage, trials grouped by EFO/MedGen keys. Falls back to `_normalize_indication()` keyword matching otherwise. Scoring logic/thresholds unchanged. All 27 tests pass.

**Why:** Enriched path reduces false peers (broad "oncology" -> specific "breast carcinoma" vs "TNBC"). Production-safe: backward compatible, non-destructive, bounded activation.

**indication_master expanded (2026-03-28)**: 50 -> 1,568 conditions (min_tickers=3). EFO 83%, MedGen 96%. Rare disease flags: 390 (keyword + EFO therapeutic area heuristic). NOISE filter expanded to 21 entries. `--min-tickers` CLI flag added.

**Open Targets enricher FIXED (2026-03-28)**: Two bugs — (1) `... on Drug` inline fragment silently ignored on SearchResult type (same fix as indication_master two-step query), (2) `maxPhaseForIndication` renamed to `maxClinicalStage` in OT API. Now 218/309 tickers enriched, 14,833 disease associations.

**Condition aliases**: 156 total (34 added 2026-03-28). Covers variant spellings, abbreviations, parenthetical forms.

**PEV enrichment**: disease_match_confidence high+medium went from 19.2% -> 66.4% of programs.

**Cache resilience concern**: 7 date-stamped artifacts per snapshot, each with external API deps. Fallback: use most recent cached version + flag staleness. Must be explicit in builder logic before production use.

**rNPV / indication opportunity framework**: RESEARCH-ONLY. Dossier-level tool for deep review, not screening-level.

**Next steps:**
- Track enrichment metrics over time: n_enriched, % coverage, peer_set_changes, median competitor_count delta
- Each new feature from enrichment data needs its own governance decision + signal evidence before promotion
- Enrichment data existing != permission to use it in scoring
- Remaining 33.6% low-confidence programs are long-tail conditions (<3 tickers) — acceptable
