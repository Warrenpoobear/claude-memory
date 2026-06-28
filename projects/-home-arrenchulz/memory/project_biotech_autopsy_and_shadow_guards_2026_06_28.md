---
name: project-biotech-autopsy-and-shadow-guards-2026-06-28
description: YTD Top-30 failure post-mortem (7 windows) + 3 shadow monitors deployed on research branch 2026-06-28
metadata: 
  node_type: memory
  type: project
  status: active
  related: 
    - project-rank-depth-shadow-2026-06-28
    - scoped-work-freeze-2026-06-22
    - ees-shadow-monitor-state-2026-06-23
    - project-model-investability-verdict-2026-06-26
  originSessionId: 71af1b31-5cba-4cbf-b44d-2150b303bd3c
---

YTD Top-30 forensic attribution post-mortem completed 2026-06-28 + shadow guard
infrastructure deployed. `VALIDATION_INFRASTRUCTURE / FAILURE_MODE_SHADOW_GUARDS / NO_MODEL_CHANGE`.

**Branch:** `research/failure-mode-shadow-guards-2026-06-28`  
**Commits:** `ddfa5c17` (autopsy) + `05a963df` (shadow guards)

## Autopsy findings

7 failure windows analyzed (Jan–Jun 2026); 4 of 6 classified avoidable:

| window | xs | class | avoidable |
|--------|----|-------|-----------|
| 2026-03-16 | -2.92pp | BROAD_SECTOR_BETA | NO |
| 2026-05-04 | -1.95pp | EES_WOULD_HAVE_HELPED | YES |
| 2026-05-19 | -1.67pp | EES_WOULD_HAVE_HELPED | YES |
| 2026-05-26 | -2.45pp | EES_WOULD_HAVE_HELPED + REPEAT_OFFENDER | YES |
| 2026-06-01 | -1.64pp | REPEAT_OFFENDER_CONCENTRATION | YES |
| 2026-06-08 | -1.44pp | BROAD_SECTOR_BETA | NO |

Key numbers: EES avg delta across failure windows = +0.82pp; bench (31-60) avg delta = +1.64pp. CELC/ABVX serial offenders (5 windows each). EES caught aftermath of ABVX collapse; did NOT catch Mar-16 (broad beta) or Jun-08 (broad beta).

Serial offenders still in Top-30 at seed run (2026-06-28): ABVX/DRUG/PRAX flagged, 9 watch.

## Shadow monitors deployed

Three monitors + drawdown trigger + weekly card, all observation-only:

| script | question | gate |
|--------|----------|------|
| `repeat_offender_monitor.py` | Are serial bottom-5 names predictive? | 10w + persistence evidence |
| `ees_guarded_shadow.py` | Does EES-excluded basket beat raw? | 20w, +delta, >=60% positive |
| `rank_depth_replacement_shadow.py` | Is bench advantage failure-specific or persistent? | 20w, >+0.5pp bench delta |
| `rolling_drawdown_trigger.py` | 4-window rolling XS <= -5.00pp alert | fires immediately |
| `weekly_failure_mode_card.py` | Aggregates all 4 monitors weekly | — |

Seed state: 0/20 windows on EES and rank-depth gates. Drawdown trigger OK (+4.66pp).
EES-excluded from current Top-30: ORIC/STOK/TNGX/ABVX/XENE (5 names, filled from bench).

## Skill

Self-improving forensic skill at `~/.claude/skills/biotech-autopsy/SKILL.md`.
15 lessons learned from first run. Key: `ees_v3_gate` is boolean not string; `market_cap_mm` not `market_cap_usd`; `regime_label` = 'UNKNOWN' all 2026.

## Promotion gates doc

`docs/SHADOW_GUARD_PROMOTION_GATES.md` — controlled promotion ladder.
What promotion explicitly does NOT authorize: removing CELC/ABVX manually, hard-vetoing
catalyst buckets, promoting EES into selector, changing final_score/actionable_rank.

## Why

**Why:** 4 of 6 failure windows had avoidable pre-window signals. Shadow monitors accumulate
evidence before any production change is authorized.

**How to apply:** Weekly card runs Monday morning. Check promotion gate status monthly.
No model change until gate is met AND operator authorizes. Do not treat early positive
EES shadow deltas as "EES is proven."
