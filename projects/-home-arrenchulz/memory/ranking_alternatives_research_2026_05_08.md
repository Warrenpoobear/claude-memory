---
name: Ranking alternatives research 2026-05-08
description: T1–T7 Kanban audit of production ranker + 10 alternatives; all T8 escalations resolved; Specs 093–097 complete; commits through aed9bd5d
type: project
status: active
related: biotech_stabilization_checkpoint_2026_05_08.md, biotech_ranker_active_contract_2026_04_30.md
originSessionId: 7b08d917-2ea2-425d-802c-02e5176e6866
---
7-memo Kanban audit (T1–T7) of production ranker and 10 candidate alternatives. Research only — no code changes, no signal promotion. Commit `4cb78899` on origin/main.

## Category assignments (Alt 1–10)

| Alt | Category |
|-----|----------|
| 1 — Momentum | LOW_POTENTIAL (archive) |
| 2 — inst_delta_z | MEDIUM_POTENTIAL_SHADOW (~2026-07-15) |
| 3 — Catalyst timing | HIGH_POTENTIAL_BUT_BLOCKED (Spec 071 Lane 2 ~Q3) |
| 4 — Catalyst quality | HIGH_POTENTIAL_BUT_BLOCKED (Spec 071 Lane 2 ~Q3) |
| 5 — financial_score | NEEDS_HUMAN_REVIEW (Gate 1 unresolved) |
| 6 — Event-EV | HIGH_POTENTIAL_BUT_BLOCKED (Spec 077 join fix, no timeline) |
| 7 — EES v3 | NO_GO PERMANENT |
| 8 — Clinical design | NO_GO |
| 9 — Hybrid composite | NO_GO (>=2027) |
| 10 — No-ranker comparator | MEDIUM_POTENTIAL_SHADOW (computable now) |

## T8 escalations — status

1. **financial_score sign direction [RESOLVED 2026-05-08]** — INTENTIONAL (stress-upside thesis). Encoding `higher_is_better=True` verified; confirmed TRUE PENALTY in bull (NW-t=−3.42) and bear (−3.38); 45-month OOS IC +0.143 (t=2.98) beats 5-feat. MODEL_DOCUMENTATION.md causal hypothesis + falsification criteria complete (Spec 074). Determination at `spec_093_determination_2026_05_08.md`, commit `aed9bd5d`. Ablation IC deferred to Gate 4 (~2026-07-15) — non-blocking.
2. **EES v3 closure confirmation [RESOLVED 2026-04-30]** — permanently closed.
3. **Spec 077 join fix timeline [RESOLVED — recharacterized]** — binder shipped; prospective accumulation is blocker (not join fix). 37 postmortems with field; 0 non-null. Gate 3: n≥15 first look. Monthly monitoring via Spec 096.
4. **Spec 071 Lane 2 timeline [ROADMAP CONFIRMED]** — ~Q3 2026. Descriptive monitoring unblocked (Spec 097). Blocks Alts 3+4 formal IC.

## Key findings

- Coinvest double-count confirmed: ρ(coinvest_score_z, final_score) = +0.882
- `common/ranker_active_contract.py` does not exist on disk (referenced in 5 audit docs — stale)
- IC tool bug: `ic_decomposition.py` measures full ~297-ticker universe, not top-60 cohort (Gate 7 open)
- PROMOTION_ELIGIBLE horizon: 2027-04-17 (year stability gate)
- Alt 10 (no-ranker comparator) immediately computable from forward_returns_panel.csv; no gates required

## T8 verdict: APPROVE_SPEC_BACKLOG (2026-05-08)

Escalation decisions:
1. financial_score: CRITICAL / human review required (Spec 093)
2. EES v3: permanently closed (confirmed)
3. Event-EV: sample-size monitoring gate, not join fix (Spec 096)
4. Spec 071 Lane 2: roadmap confirmation; descriptive monitoring unblocked (Spec 097)

## Spec backlog created (specs 093–097, commit ca9388df)

- Spec 093: financial_score sign direction review (Priority 1 — only production-correctness question)
- Spec 094: Alt 10 no-ranker selector comparator (Priority 2 — no gates, run now)
- Spec 095: Top-60 ranker IC evaluation scope definition (Priority 3 — closes Gate 7)
- Spec 096: event_ev_p_hit monitoring gate — n=15 first look, n=30 formal IC (Priority 4)
- Spec 097: catalyst timing/quality descriptive monitoring in top-60 (Priority 5 — shadow only until Lane 2)

**Why:** Architecture frozen; need evidence base before any ranker changes. T8 approved backlog; Spec 093 is the only item requiring immediate human action.
**How to apply:** Next session: run Spec 094 (Alt 10 descriptive analysis — no gates required). Spec 093 requires human to review original training config. Do not start IC tests until Spec 095 scope is confirmed.
