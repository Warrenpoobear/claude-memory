---
name: 2026-03-20 session — full operating pass + DEM diagnostics + automation
description: Financial refresh, DEM sizing/sort audits, catalyst type taxonomy, optionality monitor, repo cleanup, daily automation
type: project
---

## Commits (12 total across 2026-03-19 evening + 2026-03-20)
- `670dc442` — Financial refresh (348/348 EDGAR) + universe cleanup (349→341, 11 delisted, MNMD→DFTX)
- `dea39ddc` — Rank-aware sizing diagnostic (size-band wins, no change warranted)
- `0737275d` — Liquid assets fix ($20.2B AFS debt in 58 tickers)
- `afbff53c` — Clinical optionality stability monitor (WARN-only gate, wired into production)
- `05640993` — Spec 030: catalyst type taxonomy (DRAFT)
- `333710b2` — Catalyst type quality multiplier implementation (default OFF, v1.12.0 / b7511c92)
- `03ea2777` — PIT parity fix for clinical_rank_pct_dev
- `27a18a09` — Repo cleanup (11,570→1,627 tracked files, 9,943 untracked)
- `a555bd4e` — Untrack 18 dead root-level scripts
- `bc71a65d` — Automated daily production cron wrapper (5:30 PM ET weekdays)
- `b3fbb70e` — Windows Task Scheduler setup for persistent WSL2 activation

## Live System State
- **Active ruleset**: `9f1f4587` / v1.11.0 — FROZEN, do not change
- **Optionality monitor**: YELLOW/PASS — 20d IC +0.116, 100% sign positive, 60d not yet matured
- **Daily production**: automated via cron (5:30 PM ET weekdays) + Windows Task Scheduler backup
- **2026-03-20 run**: WARN, promoted, 190 eligible, 103 core, 87 binary, 49 shadow positions

## Shadow Candidates (all default OFF)
- **Catalyst tilt** (`a08749e4`): strongest candidate, L3 sizing only, weekly gate not yet cleared
- **Build_window clinical** (`d59b6cc3`): NEEDS_MORE (+0.01pp)
- **PCR penalty** (`eeded48d`): tiebreak w=0.25, build_window CLINICAL, temporal borderline
- **Catalyst type taxonomy** (`b7511c92` / v1.12.0): just implemented, unevaluable until live snapshots accumulate

## Key Diagnostic Findings
- DE selection works: +10.46% 60d residual vs +6.36% composite baseline
- Size-band sizing is best: > rank-aware > equal-weight (no change needed)
- **Top-of-book is 100% clinical optionality** for binary_now + build_window
- Overlays only matter for less_binary (names 23+)
- Liquid assets: 58 tickers were undercounting by $20.2B total (fixed)
- PIT/live parity: clinical_optionality_pct_dev CONFIRMED identical

## DO NOT TOUCH
- No live ranker change before April evidence
- No sizing change (proven best-of-three)
- No shadow promotion before governance gates clear
- Formatter stash (`formatter-hygiene-pass-780-files-restash`) kept separate

## Next Decision Dates
- **~Apr 1-3**: BIIB/CELC/PVLA/TBPH hard-catalyst outcomes → mean_rr gate (need 3/5 correct)
- **~Apr 8**: PCR panel Mar-19 5d outcomes → rerun focused study
- **~Apr 10-14**: Catalyst tilt weekly gate re-check (3-5 weeks from mid-March)
- **~Apr 16**: Feb-20/Feb-27 20d PCR maturation
- **~Late April**: Optionality monitor 60d maturation → GREEN/RED classification
- **Ongoing**: daily production runs automatically, watch for optionality RED
