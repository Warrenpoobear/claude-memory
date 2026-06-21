---
name: biotech_containment_governance_2026_06_21
description: "Biotech repo containment (INC-2026-06-20-AUTOPUSH) + governance/model-confidence package; durable docs at ~/governance_package_2026_06_21/; sequence A-E; July 8 packet amended (U2 co-primary)"
metadata:
  node_type: memory
  type: project
  status: active
  date: 2026-06-21
  relatedTo: "hermes_update_2026_06_21, phase2_daily_monitoring_checklist_2026_06_05, robinhood_live_execution_2026_06_10"
  originSessionId: ec7a4958-2a85-44e3-bb58-cf66e6fa3931
---

# Biotech Containment + Governance Package — 2026-06-21

## Incident
INC-2026-06-20-AUTOPUSH: autonomous writer committed/pushed directly to `main`; cleanup auto-reverted by a still-live watcher; ~59MB herald_cache (626 files) + file deletions churned. **Production ranker/selector code NOT breached** — repo history/hygiene only. Repo frozen at `origin/main = d9531c7b`. Remote switched to SSH this session (HTTPS password auth dead; gh token was invalid; SSH key works). See [[hermes_update_2026_06_21]] for fleet containment.

## Durable governance package (OUTSIDE repo, not under git)
`~/governance_package_2026_06_21/` — **v1.7, 17 docs + README** (5 classes: core design 10, communication/attribution 2, money-lane 2, ranking overlay 2, Hermes integration 1). Originals were in session scratchpad (ephemeral); this is the persistent copy.

### Ranking overlays (human research, NOT production ranker)
- Human shadow rank (current 15): 1 URGN 2 RVMD 3 NRIX 4 SYRE 5 DNTH (PROTECT) · 6 COGT 7 XENE 8 DRUG (HOLD) · 9 STOK 10 PRAX 11 ALMS 12 CMPS (WATCH) · 13 SLDB 14 TRVI (TRIM-WATCH) · 15 ERAS (EXIT-WATCH).
- Model-vs-human disagreement ledger: model rank RECONSTRUCTED (proxy), HIGH-confidence only for documented top-3 COGT/DNTH/NRIX; all other gaps PROVISIONAL until actual model rank read post-containment. Hypothesis (unconfirmed): ranker overweights static quality/momentum, underweights recent de-risking + commercial-stage. To be adjudicated July 8.

### Hermes integration (design/contracts only — Hermes stays CLOSED)
Map v0.1: 5 read-only roles (Cockpit, Gatekeeper, Ranking Evidence Tracker, Catalyst Watch Desk, Post-Containment Runner). NO agents built/activated. Class E (external observers) designable now; Class R (repo/model readers) wait for QUIESCENCE_CONFIRMED_TWICE. Gatekeeper = structural fix for broad-command near-misses.

### Post-containment sequence (locked)
quiescence ×2 → READ actual model rank for current 15 + reconcile ledger (CONFIRMED/REVISED/INVALID) → A3 cleanup → July 8 evidence run → Ranker v3 shadow decision.

### Original package docs

### Money-lane state (portfolio execution, separate from frozen model)
- Live agentic book acct ••••9084: 15 equal-weight names, ~+13% vs XBI +9.2% (6/18). Equal-weight ⇒ validates eligibility+selection (A+B), NOT ranker (C).
- **Decision 2026-06-21: HOLD all 15; zero orders.** ERAS = only impaired thesis (Apr fatal AE + RevMed IP claim + class action, lead-plaintiff deadline Aug 10) — examine-for-exit if tripwires worsen. SLDB/TRVI = trim candidates (ran on sentiment). NRIX/URGN/SYRE/DNTH/RVMD = catalyst-backed winners, hold.
- **Scale-up gate (fund account / expand to top-30): NOT YET — "earn the right to scale."** 8 pre-conditions: containment 1–4, July 8 U2 evidence 5, P&L attribution 6, top-30 data cleanup 7, operator sign-off 8. Middle path allowed: fund to CASH only, manual per-name deploy, no auto-expansion / no rank-weighting / no autonomous placement.

### Original package docs
1. funding_memo — fundability story, leads with portfolio face validity, capital stage-gated
2. ranking_confidence_plan — falsifiable audit sequence
3. july8_forward_oos_validation_packet — **AMENDED A1 (pre-data, 2026-06-21):** U2 candidate-cohort IC = CO-PRIMARY; new SELECTION-DRIVEN verdict (U1+ but U2≈0); catalyst_decay_w needs incremental IC after `selector_score` + `coinvest_score_z` (raw IC insufficient)
4. ranker_v3_design_memo — constrained design target, shadow-only, no impl authority
5. agent_governance_branch_protection_policy — PR-only agents, no direct main-write
6. post_incident_runbook — repeatable recovery
7. agent_token_separation_note — separate machine identity for agents (durable identity fix)
8. branch_protection_ui_checklist — operator UI steps (first gate)

## Containment gates (ALL must hold before any repo/agent/model work)
```
BRANCH_PROTECTION_ENABLED        ⬜ operator (GitHub UI)
ALL_AGENTS_CLOSED                ⬜ operator (halt Hermes/OpenClaw/crons)
QUIESCENCE_CONFIRMED_TWICE       ⬜ read-only poll, two spaced checks; NO git fetch unless separately approved
```
Standing freeze: no repo cleanup, no model edits, no commits, no pushes, no autonomous agent work.

## Universe audit (v1.8 appendix — external read-only, completed 2026-06-21)
Part B COMPLETE. 19 docs now in package. Key findings:
- **47 confirmed removal candidates** (acquired/delisted/BK mid-2025–Jun 2026): ITCI, BPMC, VRNA, RNA, APLS, TERN, AKRO, SLNO, KALV + 18 mid/small M&A + 5 Concentra wind-downs + 13 BK/delistings
- **IOBT highest urgency**: delisted Jun 18, 2026 (3 days ago); if in universe = live stale-ticker incident
- **21 confirmed add candidates** (IPOs missing): KLRA, PBLS, KARD, GENB, EIKN, AKTS, AVLN, COAG, ODTX, SPTX, AGMB, MANE, SGP (H1 2026 priority)
- **7 H2 2026 PDUFA names to verify**: VERA, CELC, OTLK, CAPR, SRRK, BBIO, ROIV
- All 15 live holdings confirmed active/tradeable; ETF CSVs stale (2026-01-07); `auto_download_etf_holdings.py` is Part C refresh tool

**First Part A checks post-containment (priority order):**
1. IOBT present? → if yes, stale universe confirmed (live incident)
2. KLRA / PBLS / GENB / KARD present? → if no, completeness gap confirmed
3. SLRN present? → if yes, post-merger stale ticker

## Sequence
A. Finish containment (operator) ⬜ → B. Preserve package ✅ → C. Fresh A3 cleanup plan vs d9531c7b ⬜ → D. Run July 8 packet as amended ⬜ → E. Ranker v3 shadow decision ⬜

## Central model question (unresolved, pending July 8)
**Is the system merely selecting reasonable biotech names, or can it rank the best names within that selected cohort?** Truest test = U2 candidate-cohort IC. Smoking gun for "selection, not ranking" = U1 IC positive but U2 IC ≈ 0. Roadmap: July 8 (U2 co-primary) → selector/ranker incremental-IC audit → eligibility false-negative audit → only then v3 shadow features. No new features before failure mode is known.

## Governance principle
**Repo control ≠ model validity ≠ capital authorization.** Three independent gates; none substitutes for another. Scientific Cartography stays diagnostic-only (architecturally ready but sponsors don't map to public tickers → not a live alpha source).
