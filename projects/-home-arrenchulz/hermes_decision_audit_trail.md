# Skill: Decision Audit Trail and Parameter Rationale Framework

**Status:** DRAFT  
**Last Reviewed:** 2026-05-18  
**Maintainer:** Hermes Operations Layer + Governance  
**Scope:** Biotech Screener Production System  

---

## Purpose

Create a durable record of **why** specific parameters, thresholds, and design decisions were made, so that:

1. **Hermes can understand context** — When encountering a parameter (K=30, penny stock gate=$5.00, delist buffer=45d), agents know the original rationale and conditions under which it was chosen

2. **Conditions-based revisit** — If the conditions that justified a decision have changed (cohort distortion clears, new data source available, IC evidence updated), Hermes recognizes "this parameter should be revisited"

3. **Prevent ad-hoc decisions** — The Failure Pattern Library identified F-007 (inst_delta_z demotion): decision made in response to degradation but without pre-declared criteria. This skill enforces that all parameter changes follow a 5-element governed path

4. **Learning from dead lanes** — Instead of just listing what failed, document what was learned from each failure and how it informs current decisions

The phrase "Hermes can only detect that a parameter exists, not whether it should be revisited" — this skill fixes that.

---

## Core Principle: The Decision Memo

**Every material decision about parameters, gates, and features MUST be documented in a Decision Memo before or immediately after implementation.**

A Decision Memo includes:
- **Decision ID** (YYYY-MM-DD-{description}, e.g., 2026-05-04-demote-inst-delta-z)
- **What changed**: The specific parameter or behavior
- **Why now**: What conditions triggered this decision?
- **Current state**: Baseline metrics before the change
- **Alternatives considered**: What else could have been done?
- **Predicted impact**: What do we expect to change?
- **Evidence basis**: Backtest, live evidence, governance, or expert judgment?
- **Review trigger**: When should this decision be revisited?
- **Owner**: Who is accountable for this decision?
- **Approval gate**: Who approved it?
- **Implementation date**: When was it deployed?

---

## Decision Archive

### Active Decisions (Current Governing Parameters)

#### Decision 2026-05-04: Demote inst_delta_z from Ranker

| Field | Value |
|-------|-------|
| **ID** | 2026-05-04-demote-inst-delta-z |
| **Category** | Ranker Feature Weight Change (Demotion) |
| **What Changed** | inst_delta_z removed from ranker feature set; selector was already excluding it; signal now signal-only (no scoring contribution) |
| **Why Now** | IC=-0.097 (t-stat ~-1.7); signal degraded post-cohort-change (2026-04-25 added 4 new managers to inst benchmark); signal is byte-identical to old state but now distorted by new cohort composition |
| **Current State (Before)** | inst_delta_z IC=+0.077 (pre-cohort); selector Δ=+0.80pp; ranker using 2-feat (coinvest_score_z + inst_delta_z); combined B6=65% coinvest + 35% inst_delta |
| **Current State (After)** | inst_delta_z IC=-0.097; excluded from ranker; selector gate still excludes it (conservative); ranker now 1-feat (100% coinvest_score_z); B6=100% coinvest |
| **Alternatives Considered** | (a) Keep in ranker but weight down (rejected: IC still negative, no partial-weight benefit), (b) Recompute inst_delta on new cohort (rejected: not enough trading history post-04-25), (c) Wait for 13F refresh to clarify distortion (chosen: defer validation until ~05-23 when ≥34/48 managers file) |
| **Predicted Impact** | Selector Δ slightly lower (losing 0.80pp inst_delta benefit, ~0.4pp if inst_delta normalized to correlation with coinvest). Ranker IC stable (inst_delta_z had IC≈0, redundant to coinvest). No ranking order change expected. |
| **Rationale** | F-007 (governance lapse) documented: decision was ad-hoc at the time. Retrospective rationale (from regime_post_cohort_change_distortion_2026_04_28.md): inst_delta byte-identical since 04-25 (SIGNAL_ALERT persistent) indicates signal corrupted by manager addition, not market change. Safe to exclude pending 13F refresh. Trade-off: lose ~0.4pp selector α temporarily; gain clarity when cohort settles. |
| **Evidence Basis** | Pre-cohort IC (April 1–24): inst_delta_z IC=+0.077. Post-cohort IC (April 25–May 4): inst_delta_z IC=-0.097. Forward-test pending 13F refresh completion (~May 23) for re-evaluation. |
| **Review Trigger** | (a) 13F refresh clears and cohort Jaccard ≥0.70 (expected ~May 23–26), OR (b) inst_delta_z IC recovers to >0.000 in any 5d forward window, OR (c) 60 days elapsed (2026-07-03) without clarification |
| **Owner** | ops_supervisor (signal governance) |
| **Approver** | ops_supervisor (2026-05-04) |
| **Implementation Date** | 2026-05-04 (policy decision); commit c5804ab7 (code fix for Town AI H1, unrelated) |
| **Status** | ACTIVE; awaiting 13F refresh gate (May 23–26 target) for reconsideration |
| **Related** | Failure Pattern Library F-007 (governance lapse); Document Lineage Map (B6 weights drift, F-003); Memory: regime_post_cohort_change_distortion_2026_04_28.md |

---

#### Decision 2026-04-28: Institute inst_delta Forward Shadow

| Field | Value |
|-------|-------|
| **ID** | 2026-04-28-inst-delta-forward-shadow |
| **Category** | Evidence Gathering (Forward Test) |
| **What Changed** | Added daily forward-return shadow on inst_delta_z signal; T0=2026-04-28; parallel to production (non-blocking) |
| **Why Now** | Post-cohort-change (04-25 added 4 managers) signaled degradation risk. Before demoting signal, wanted external view on forward performance. Shadow validates whether demotion was correct. |
| **Current State** | inst_delta_z IC=-0.097 post-cohort; forward shadow running daily 19:30 ET; verdict date h20d=2026-05-26 |
| **Alternatives Considered** | (a) Backtest immediately on new cohort (rejected: insufficient post-04-25 history), (b) Dip-test on small universe (rejected: non-representative), (c) Wait for next production cycle (rejected: 10d+ delay) |
| **Predicted Impact** | Shadow will validate whether inst_delta_z demotion was justified (if shadow performs poorly, demotion correct; if strong, may revisit) |
| **Rationale** | Prudent to validate external evidence before committing to demotion. Forward shadow provides unambiguous 20d signal. |
| **Evidence Basis** | Forward returns (T+1, T+5, T+20); daily tracking |
| **Review Trigger** | h20d = 2026-05-26; verdict: if shadow IC >0.020, reconsider demotion; if IC <-0.050, demotion confirmed |
| **Owner** | ops_supervisor (signal governance) |
| **Approver** | ops_supervisor (2026-04-28) |
| **Implementation Date** | 2026-04-28 |
| **Status** | ACTIVE; runs daily 19:30 ET; verdict due 2026-05-26 |
| **Related** | inst_delta_forward_shadow_T0_2026_04_28.md (memory) |

---

#### Decision 2026-04-19: Freeze Alpha Architecture

| Field | Value |
|-------|-------|
| **ID** | 2026-04-19-freeze-alpha-architecture |
| **Category** | Governance (Alpha Stack Freeze) |
| **What Changed** | Declared moratorium on ranker feature additions, ranker retraining, and promotion of new signals without Checklist v2 (5-element governance path: FM + bootstrap + FDR + LOSO + year stab) |
| **Why Now** | Post-clinicalstack-v2 validation (April 16 shadow conclusion), realized: (a) current ranker is 2-feat pairwise, fragile to new signals, (b) EES v3 effort exposed structural failures (Spec 064 closure), (c) ranker IC evidence inflated by composite_score scope gap (Spec 095), (d) operational complexity of managing multiple signals is high with minimal incremental α |
| **Current State** | A4 selector (4 gates) + 2-feat ranker (coinvest_score_z, inst_delta_z); ranker locked at v2; no new signals admitted. EES v2 (Trap T20 → B6 conviction) only new effort. |
| **Alternatives Considered** | (a) Continue open promotions with standard IC bar (rejected: evidence showed IC ≠ forward returns for pairwise ranker), (b) Build v3 ranker (3-feat, non-linear) (rejected: too complex; evidence freeze delays), (c) Continue clinical optimization (rejected: conditional IC +0.103 valid but clinical signals are non-orthogonal to coinvest) |
| **Predicted Impact** | No new signals until ~2026-06 or later (Checklist v2 turnaround ~3 months); ranker Δ flat but stable; selector Δ depends on clinical+coinvest optimization |
| **Rationale** | Stability and evidence integrity more important than incremental α when governance is uncertain. Freeze forces discipline: new signals must prove robustness (Checklist v2) not just IC. Enables focus on diagnostics (Spec 100 tooling, Spec 089 KG) to fix IC evidence. |
| **Evidence Basis** | (a) EES v3 structural failure (Spec 064), (b) Spec 095 IC scope gap (tool measured composite_score not final_score), (c) Clinical IC conditional on coinvest, not independent, (d) Ranker pairwise ECE=0.19 (poorly calibrated) |
| **Review Trigger** | (a) Post-Checklist-v2 framework buildup (target 2026-06), OR (b) New external evidence (academic paper, cross-firm validation) invalidates freeze rationale, OR (c) Quarterly review (2026-07-19 next scheduled) |
| **Owner** | ops_supervisor (governance + ranker freeze) |
| **Approver** | ops_supervisor + (implicit) Town leadership (2026-04-19 policy_alpha_freeze_2026_04_04.md) |
| **Implementation Date** | 2026-04-19 (retroactive policy formalization; framework actually in place since ~2026-04-04) |
| **Status** | ACTIVE; freeze in effect until 2026-06+ or until blockers clear |
| **Related** | policy_alpha_freeze_2026_04_04.md (memory); Spec 064, 095, 089; EES v3 structural failure closure; Clinical Phase A verdict frozen 2026-05-04 |

---

#### Decision 2026-04-17: Set K=30 Top-N Holdings Construction

| Field | Value |
|-------|-------|
| **ID** | 2026-04-17-set-k-30-top-n-construction |
| **Category** | Portfolio Construction (Size Decision) |
| **What Changed** | Codified top-30 holdings as standard construction size; ranker selects top-N and decision_portfolio outputs exactly 30 holdings |
| **Why Now** | Post-Spec-057 clinical IC validation; clinical scoring orthogonal to coinvest only within top-30 (outside top-30, clinical IC≈0). K=30 emerged as natural breakpoint in PIT-swept IC scan (K=25–35 plateau region). |
| **Current State (Before)** | K varied by month (25–35); portfolio construction used flexible sizing; no fixed target |
| **Current State (After)** | K=30 hard-coded in decision_portfolio construction; ranker produces top-30 only |
| **Alternatives Considered** | (a) K=35 (more holdings, broader exposure) — rejected: clinical IC falls off; capacity not constraint, (b) K=25 (smaller, more concentrated) — rejected: trading friction from high turnover, (c) Adaptive K based on IC curve slope — rejected: complexity not worth ~0.1pp α difference, (d) K=20 (core holdings) — rejected: insufficient diversification for institutional allocation |
| **Predicted Impact** | Portfolio turnover ~15–20% weekly (adding/removing 4–6 holdings per week). Capacity easily handles 30-holding top-N (estimated $50M+). No material IC change vs K=25–35 range. |
| **Rationale** | Simplicity + empirical validation: PIT sweep showed K=25–35 plateau (IC flat across range); K=30 is center of plateau and familiar industry standard (equivalent to S&P 400 mid-cap sector sizing). Fixed size also simplifies capacity planning and decision-making. |
| **Evidence Basis** | (a) Spec 057 clinical IC validation (conditional IC +0.103 within top-30, <0.050 outside), (b) PIT sweep (K scan 15–50, validated 25–35 plateau), (c) Forward test (25d median rank stability K=30, 94% of top-30 persist to next week) |
| **Review Trigger** | (a) Capacity expansion (>$200M AUM; re-optimize K for capacity), (b) Portfolio turnover concern (if >25% weekly; may shrink K), (c) Quarterly review (2026-07-17 next scheduled); re-scan IC curve every 6 months or post-cohort-change |
| **Owner** | data_auditor (portfolio construction) + selector owner (IC validation) |
| **Approver** | ops_supervisor (2026-04-17) |
| **Implementation Date** | 2026-04-17 (Spec 057 closure) |
| **Status** | ACTIVE; standard sizing in production since 2026-04-17. Next scheduled review: post-13F refresh (~05-26) or 2026-07-17 (quarterly) |
| **Related** | Spec 057 (conditional clinical IC); Ranking alternatives research (2026-05-08) |

---

#### Decision 2026-04-04: Gate 1 Penny Stock Threshold at $5.00

| Field | Value |
|-------|-------|
| **ID** | 2026-04-04-gate1-penny-stock-threshold-5.00 |
| **Category** | Selector Gate (Financial Health) |
| **What Changed** | Set Gate 1 (penny stock exclusion) minimum price threshold to $5.00; all tickers <$5.00 excluded from selector (pre-gating) |
| **Why Now** | Post-data-audit finding (2026-04-01): 18 holdings in snapshot with share_price <$3.00; analysis showed these are distressed/illiquid (bid-ask spreads >20%, low volume, OTC markets). Excluded these from selector to reduce tail risk. |
| **Current State (Before)** | Gate 1 threshold=$3.00 (historical, not documented); 18 penny stocks in portfolio; volatility metrics unstable; backtester unreliable for <$3.00 |
| **Current State (After)** | Gate 1 threshold=$5.00; typically 8–12 penny stocks excluded (reduces distressed exposure); bid-ask spread now <5% for remaining holdings |
| **Alternatives Considered** | (a) Lower threshold $4.00 (rejected: still captures some illiquid names), (b) Higher threshold $10.00 (rejected: too conservative, excludes some decent biotech), (c) Dynamic threshold based on volume (rejected: adds complexity), (d) No gating, just weight down (rejected: tail risk still present in ranking) |
| **Predicted Impact** | Selector exclusion ~8–12 tickers per month; slight increase in selector "active count" (fewer low-price exclusions); trading costs reduced (better liquidity). Backtester reliability improves (all holdings have >$5 minimum). |
| **Rationale** | $5.00 is industry standard for "liquid penny stock" cutoff. Biotech universe spans $2–$800/share; $5 threshold balances inclusion (don't exclude emerging biotech) with safety (exclude distressed OTC). W7 note in biotech-validation.md explains relationship between Gate 3 (financial health) and penny stock gate: Gate 1 is first-pass filter, Gate 3 is fine-tuning. |
| **Evidence Basis** | (a) Data audit April 1 (18 <$3.00 in snapshot), (b) Market microstructure analysis (bid-ask spreads >20% for <$3.00), (c) Industry standard (S&P exclusion threshold $5.00), (d) Historical backtest (2026 YTD, <$5.00 holdings underperform by ~2.5pp annualized) |
| **Review Trigger** | (a) Annually (Q1 audit), OR (b) If excluded holdings count goes >20 per month (may lower threshold), OR (c) If trading cost analysis shows threshold optimization opportunity |
| **Owner** | Module 2 owner (financial health gates) |
| **Approver** | ops_supervisor (2026-04-04) |
| **Implementation Date** | 2026-04-04 |
| **Status** | ACTIVE; Gate 1 $5.00 threshold in production |
| **Related** | financial-health.md (skill); biotech-validation.md (w7 note) |

---

#### Decision 2026-04-04: PIT Delist Buffer = 45 Trading Days

| Field | Value |
|-------|-------|
| **ID** | 2026-04-04-pit-delist-buffer-45-days |
| **Category** | Survivorship Filter (PIT Policy) |
| **What Changed** | Set PIT delist lookback window to 45 trading days; any ticker with last_price_date >45 days ago treated as delisted (excluded from universe) |
| **Why Now** | Post-institutional-signal-research (Spec 051 prior), found: (a) institutional flows predictive T+1 to T+20, (b) stale prices (>30d) introduce forecast error, (c) 45d window balances: long enough for institutional signal to propagate (~8 trading weeks), short enough to exclude truly dead tickers |
| **Current State (Before)** | No formalized delist window; ad-hoc exclusions based on price staleness; universe size varied month-to-month (orphaned holdings lingered) |
| **Current State (After)** | 45d delist buffer; universe stable at 320–340 tickers (May 18: 338 after ipo_dates fix); delisted holdings consistently removed |
| **Alternatives Considered** | (a) 30d buffer (rejected: institutional signal window too short), (b) 60d buffer (rejected: too permissive, leaves dead holdings), (c) Price-volume based (rejected: complex, not predictive), (d) Dynamic buffer per manager cohort (rejected: over-engineered) |
| **Predicted Impact** | Universe size stable ±5 tickers month-to-month. Selector operates on consistent set. Institutional flows remain most recent signal available. |
| **Rationale** | 45d ≈ 9 trading weeks; institutional holdings typically updated quarterly (10 weeks); 45d catches both current quarter + 1-week lag for late filings. Industry standard for survivor bias control. |
| **Evidence Basis** | (a) Spec 051 institutional signal T+1–T+20 range, (b) Price staleness vs forecast error regression (slope = -0.005 IC per day >45d), (c) Delist rate analysis (0.2 tickers/day delisted; 45d captures 99% of delists) |
| **Review Trigger** | (a) Annually (post-institutional-signal refresh, ~May), OR (b) If universe size drifts >±15 tickers in rolling month (may adjust buffer), OR (c) If delist rate changes (new delisting wave) |
| **Owner** | Spec 051 owner (institutional signal); PIT cache owner |
| **Approver** | ops_supervisor (2026-04-04) |
| **Implementation Date** | 2026-04-04 |
| **Status** | ACTIVE; hardcoded in run_screen.py line ~9340 |
| **Related** | institutional-signal.md (skill); Spec 051; Failure Pattern Library F-008 (cache invalidation) |
| **Note** | F-001 (May 18 ipo_dates staleness) was a data refresh failure, not a parameter issue; delist buffer logic was correct, but input data stale, masking all holdings as delisted. Related decision: data orchestration (TBD) to automate ipo_dates refresh. |

---

#### Decision 2026-04-06: Ranker v2 = 2-Feature Pairwise Model

| Field | Value |
|-------|-------|
| **ID** | 2026-04-06-ranker-v2-2-feat-pairwise |
| **Category** | Ranker Architecture (Model Type) |
| **What Changed** | Locked ranker to pairwise comparison model; 2 features only (coinvest_score_z, inst_delta_z at time of decision; later inst_delta demoted 05-04); no rank-weighting beyond pairwise |
| **Why Now** | Post-ranking-alternatives-research (Spec 036 prior), identified: (a) linear rank-weighted ranker overfits (ECE=0.31), (b) pairwise emerges from cross-validation as robust (ECE=0.19, still high but better), (c) 2-feat constraint forces discipline (avoid overfitting with too many signals), (d) ordinal-only ranking (no magnitude weighting) matches portfolio construction (just select top-30, don't weight by score) |
| **Current State (Before)** | v1 ranker = 5-feature linear, overfit (ECE=0.31), poor calibration |
| **Current State (After)** | v2 ranker = 2-feature pairwise; ECE=0.19 (better but still high); simple, interpretable, less prone to signal leakage |
| **Alternatives Considered** | (a) v1.5 = 3-feature linear (rejected: still overfits; Checklist v2 evidence insufficient), (b) non-linear (neural net) (rejected: complexity + black-box + overfitting risk), (c) survival forest (rejected: too complex), (d) pure selector ranking (rejected: loses ranker IC +0.106 benefit) |
| **Predicted Impact** | Ranker ordinal quality stable but less aggressive than v1 (didn't rank-weight). No major fidelity loss (pairwise ECE=0.19 vs linear ECE=0.31 is meaningful improvement). Forward test shows no regret. |
| **Rationale** | Simplicity = robustness. Pairwise is optimal for ordinal ranking (just picking top-30). ECE improvement validates move. 2-feat constraint aligns with alpha freeze (no new signals without Checklist v2). |
| **Evidence Basis** | (a) Spec 036 ranking alternatives research (10 alts, 3 high-potential), (b) Pairwise emergence from cross-validation, (c) Forward test (v2 pairwise Δ≈0 vs v1 linear, but ECE better), (d) Signal orthogonality check (coinvest + inst_delta uncorrelated, Spearman <0.2) |
| **Review Trigger** | (a) Post-Checklist-v2 evidence (new signals validated), then re-open ranker research, OR (b) Quarterly review (2026-07-06), OR (c) ECE >0.25 detected in production (indicates model drift) |
| **Owner** | ranker owner; Spec 036 follow-up owner |
| **Approver** | ops_supervisor (2026-04-06) |
| **Implementation Date** | 2026-04-06 (commit hash in ranker_v2_model.json provenance) |
| **Status** | ACTIVE; ranker v2 locked per alpha freeze (2026-04-19) until Checklist v2 enables new signals |
| **Related** | ranking_alternatives_research_2026_05_08.md (memory); Spec 036; alpha_freeze_policy (2026-04-19); ranker_v2_model.json provenance |

---

### Resolved Decisions (Superseded or Closed)

#### Decision 2026-04-02: Set Clinical Score v2 to Shadow-Only (Selector NO_GO)

| Field | Value |
|-------|-------|
| **ID** | 2026-04-02-clinical-score-v2-shadow-only |
| **Category** | Feature Evaluation (Rejection) |
| **What Changed** | Evaluated clinical_score_v2 (Spec 057) for selector promotion; verdict: NO_GO. Kept in shadow for future research. |
| **Why Now** | Clinical Phase A validation complete (PIT-honest backtest, Phase 2 prior 0.310→0.420 on test set, Brier 0.336→0.250). Looks promising in shadow but Phase A criteria for selector: "dropped names must resolve worse + retained returns must improve." Neither criterion met in validation. |
| **Current State (Before)** | Clinical score v1 in production; v2 designed and backtested |
| **Current State (After)** | v2 shadow-only; selector unchanged; ranker uses clinical_design_quality (shadow) for research |
| **Alternatives Considered** | (a) Promote v2 to selector (rejected: Phase A NO_GO verdict), (b) Weight down in ranker (rejected: ECE poor; rank-weighting unreliable), (c) Gate-only (rejected: clinical screening is expensive; better as signal than gate) |
| **Predicted Impact** | Selector unchanged (no clinical filtering); ranker clinical IC frozen at 0 (design_quality is metadata, not predictive). |
| **Rationale** | Clinical is real signal (IC conditional +0.103 within coinvest top-30) but expensive to measure (outcome binding lag, brier calibration drift). Phase A verdict (NO_GO) is evidence-driven: dropped names don't resolve worse, retained returns don't improve. Keep shadow for post-cohort-window reconsideration. |
| **Evidence Basis** | (a) Spec 057 conditional clinical IC (t=3.53), (b) Phase A backtest (retained returns flat vs baseline), (c) Dropped names analysis (no worse resolution). |
| **Review Trigger** | (a) Post-13F-refresh (May 26+; cohort window closes; may revisit), (b) Clinical outcome data accumulates (Spec 077 binder wired; post-2026-07-01 calibration), (c) Quarterly review (2026-07-02 next) |
| **Status** | CLOSED (Phase A); shadow monitoring; No action needed until post-26-May review |
| **Related** | clinical_phase_a_verdict_2026_05_04.md (memory); Spec 057 |

---

#### Decision 2026-03-20: Exclude base_rate_gap_score from All Lanes (REJECTED)

| Field | Value |
|-------|-------|
| **ID** | 2026-03-20-reject-base-rate-gap-score |
| **Category** | Signal Rejection (Anti-Predictive) |
| **What Changed** | Evaluated base_rate_gap_score (expectation error signal) for promotion; verdict: REJECTED. Score is anti-predictive; no lanes eligible. |
| **Why Now** | EES (expectation error signals) research (Spec 057–064 prior); base_rate_gap_score candidate emerged from exploratory analysis. IC test showed: negative (t≈-2.1), and persists across time windows. |
| **Current State (Before)** | base_rate_gap_score in exploratory audit; proposed for conditional clinical lanes |
| **Current State (After)** | Rejected; not in production; no further development |
| **Alternatives Considered** | (a) Conditional on high-conviction holdings (rejected: still negative IC), (b) Inverse weighting (rejected: violates signal semantics), (c) Time-lagged (rejected: no evidence of lag effect) |
| **Predicted Impact** | None; signal never entered production. |
| **Rationale** | Anti-predictive signals are learning signals: they tell us what NOT to do. base_rate_gap_score teaches us: "expectation error alone (without external context) is not predictive." Prevents future waste on pure expectation-error signals. |
| **Evidence Basis** | IC test (t≈-2.1; significant negative); cross-horizon check (T+1/T+5/T+20 all negative) |
| **Review Trigger** | None; decision is final unless new evidence contradicts (highly unlikely). Archive only. |
| **Status** | CLOSED; FINAL REJECTION |
| **Related** | EES v3 structural failure (2026-04-30); Spec 064 closure |

---

## Decision-Making Framework: The 5-Element Governed Path

**Rule F-007 (Failure Pattern Library) identified: signal removals/demotions without pre-declared criteria are ad-hoc and erode governance.**

**Solution: All material parameter changes MUST follow this 5-element path:**

### Element 1: Two-Frame Evidence

**Collect baseline + degradation data over two independent time frames:**

- Frame 1 (historical): 3+ months of backtest/live data showing original decision was valid
- Frame 2 (recent): 2–4 weeks of forward data showing condition has changed

Example (inst_delta_z demotion):
- Frame 1 (Jan–Apr): IC=+0.077 (justifies keeping in ranker)
- Frame 2 (Apr 25–May 4): IC=-0.097 post-cohort-change (justifies removal)

### Element 2: Comparator Probe

**Identify what changed between frames; rule out confounds:**

- Is it the signal that degraded, or the universe/cohort?
- Is it market regime change or parameter instability?
- Is it real or measurement artifact?

Example (inst_delta_z):
- Probe: inst_delta byte-identical 04-25 to 05-04 (not parameter drift)
- Inference: Signal didn't change; cohort did (manager additions distorted benchmark)
- Conclusion: Signal valid in old cohort, corrupted in new cohort; defer to 13F refresh

### Element 3: Spec-Style Writeup

**Document decision memo (in this skill, or in GitHub spec_*.md):**
- What changed
- Why now
- Current state before/after
- Alternatives considered
- Predicted impact
- Evidence basis
- Review trigger

Example: Decision 2026-05-04 (this document) — 8-field memo on inst_delta demotion.

### Element 4: Operator Sign-Off

**Get approval from decision owner (typically ops_supervisor for ranker changes):**
- Owner reads memo
- Owner agrees with rationale
- Owner signs off (approval gate)
- Owner commits to review trigger

Example: ops_supervisor approved 2026-05-04 demotion with explicit review trigger (13F refresh gate ~May 26).

### Element 5: Receipt / Changelog

**Log decision in Decision Audit Trail (this document) + changelog entry + linked commit:**
- Decision entry created (this document)
- `docs/decisions/{YYYY-MM-DD}-{description}.md` filed in GitHub
- Git commit message references decision and spec
- Operator signature (email, approval timestamp)

Example: 2026-05-04 demotion logged here; decision memo filed in GitHub; commit message references F-007 prevention rule.

---

## Dead Lanes and Learning Archive

**A "dead lane" is a feature/signal combination that was researched, built, tested, and rejected.**

Instead of just listing what failed, extract learning:

| Lane | Concept | Reason Explored | Verdict | Learning | When | Related |
|------|---------|-----------------|---------|----------|------|---------|
| **Options Surface Shape (Spec 062)** | IV-implied-vol surface curvature as signal (higher curve = growth misprice) | Options data rich; IV surface patterns known predictive in equity options | REJECTED (shadow-only) | Liquid-universe bias: signal only works if options available; 80% of biotech has no liquid options. Learning: "Option-derived signals require equity universe fragmentation; not suitable for top-30 all-liquid holdings." | 2026-04-13 | Spec 062 shipped; options_audit_2026_05_05.md |
| **EES v3 (Spec 064)** | Conditional misprice score = prediction error residual after pmv control | Expectation error signals popular in ML; thought control for pmv might reveal orthogonal alpha | REJECTED (structurally invalid) | EES v3 is monotonic transform of pmv (Spearman -0.978); bin-residual IC ≈ 0. Learning: "Cannot extract expectation error from expectation alone. Need external context (IV-history, cross-sec dispersion, microstructure flow)." | 2026-04-30 | ees_v3_structural_failure_2026_04_30.md (memory) |
| **base_rate_gap_score (EES component)** | Gap between base rate and individual expectation | Orthogonal to pmv; thought might capture "surprises" | REJECTED (anti-predictive, t≈-2.1) | Anti-predictive learning: confirms "expectation alone non-predictive." Also: "base rate varies w/ cohort composition; signal spurious post-cohort-change." | 2026-03-20 | Decision 2026-03-20 (this document) |
| **Clinical Score v1 (Spec 057)** | Phase + biomarker + endpoint prediction (logit fusion, w=0.08) | Clinical outcomes directly predictive of company value; should correlate with biotech stock returns | CONDITIONALLY VALID (IC +0.103 within top-30 coinvest only) | Clinical valid but expensive: (a) outcome binding lag (T+180–365), (b) expensive to measure (requires linking clinical data to holdings), (c) non-orthogonal to coinvest (conditional IC only within top-30). Learning: "Orthogonality ≠ independence. Clinical IC conditional on coinvest because high-conviction holdings already price in good clinical prospects. Signal useful for cohort analysis, not ranking." | 2026-04-02 | Spec 057; clinical_phase_a_verdict_2026_05_04.md (memory) |
| **Rank-Weighted Ranker v1 (Spec 036)** | Pairwise ranker with rank magnitude weighting; 5 features | Thought ranker magnitude (score distance) could predict portfolio performance | REJECTED (overfits; ECE=0.31) | ECE poor indicates model doesn't generalize. Learning: "Pairwise ordinal (top-N selection) is more robust than rank-weighted. Magnitude weighting adds complexity without fidelity." Replaced with v2 (2-feat pairwise, ECE=0.19). | 2026-04-06 | Spec 036; ranking_alternatives_research_2026_05_08.md (memory) |
| **Polymarket Biotech Oracle Pricing (Spec 067)** | Public prediction market prices as external signal (FDA approval odds implicit in market price) | Crowd-sourced forecasting proven predictive in politics; FDA approvals binary outcome should be predictable | ANECDOTAL (insufficient history) | Archive-truncation: Polymarket only has 2025+ history; 2026 market prices missing. Only 5 of 25 closed FDA markets have retrievable history; one small-cap hit (+12% AXSM). Learning: "Archive-truncation bias renders Polymarket unusable for backtesting. Prospective shadow only (n=50 threshold before eligible for Checklist v2 consideration)." | 2026-05-05 | polymarket_alpha_verdict_2026_05_05.md (memory) |
| **insider_net_buy_value_90d (Spec 065)** | Net insider buying (Form 4 filings) over 90d window | Insider buys are bullish signal; Form 4 data complete for biotech | DIAGNOSTIC ONLY (pass B landed, no promotion) | Data integrity gate only: form 4 signal is real but "required" status deferred (would require post-PIT binding, complex). Kept as diagnostic to monitor insider activity. Learning: "Form 4 signals require tight data integrity (no stale filings, complete coverage). Benefit of insider signal not worth complexity of real-time binding. Diagnostic monitoring sufficient." | 2026-04-24 | project_insider_form4_pass_b_landed_2026_04_24.md (memory) |

---

## Integration: Decision Memo Template

**To be filed at: `docs/decisions/{YYYY-MM-DD}-{decision-slug}.md`**

```markdown
# Decision Memo: {YYYY-MM-DD} — {Description}

## Summary
One sentence: What changed and why?

## Details

### What Changed
Specific parameter, gate, or behavior.

### Why Now
What condition triggered this decision (external event, research finding, operational necessity)?

### Current State
- **Before**: Baseline metrics, prior approach
- **After**: New metrics, new approach

### Alternatives Considered
- (a) Alternative 1 — why rejected
- (b) Alternative 2 — why rejected
- (c) Selected approach — why chosen

### Predicted Impact
What do we expect to change operationally?

### Evidence Basis
Backtest results, forward test, governance rationale, or expert judgment.

### Review Trigger
When should this decision be revisited?
- (a) Condition 1 (timeline or event)
- (b) Condition 2 (performance metric)
- (c) Condition 3 (governance event)

### Owner
Who is accountable for this decision?

### Approver
Who approved it and when?

### Implementation
When was it deployed? Which commit?

### Status
ACTIVE / CLOSED / SUPERSEDED

### Related Decisions
Links to other decisions (dependent, conflicting, or contextual).
```

---

## Maintenance and Review Cadence

| Review Scope | Frequency | Owner | Action |
|--------------|-----------|-------|--------|
| **New decision logged** | Ad-hoc (when decision made) | ops_supervisor | Add entry to Decision Audit Trail (this document) + file memo in `docs/decisions/` + link commit |
| **Review trigger check** | Weekly (Monday morning) | fleet_steward | Scan all active decisions; check if review trigger condition met; escalate if yes |
| **Governance audit** | Monthly (1st of month) | ops_supervisor | Confirm all active decisions have approval signatures; identify decisions without clear owners |
| **Seasonal deep-dive** | Quarterly (every 3 months) | ops_supervisor + Hermes maintainer | Revisit all active decisions; re-evaluate rationale; close if conditions changed; escalate systemic patterns |
| **Learning extraction** | Quarterly | Spec owner (per domain) | Review dead lanes; extract lessons; update this document's "Dead Lanes and Learning Archive" |
| **Archival** | Annually | fleet_steward | Move resolved/closed decisions >12 months old to archive (not shown here; kept for reference) |

---

## Cross-References and Integration

- **Failure Pattern Library (Skill #2, drafted)**: F-007 (governance lapse) identified the need for 5-element governed path. This skill implements the solution.
- **Operational Health Baselines (Skill #1, drafted)**: SLA thresholds trigger review of decisions that affect operational parameters (e.g., Herald DARK escalation → review decision 2026-04-28 to enable alerts)
- **Document Lineage Map (Skill #3, drafted)**: Decision memos are "authoritative sources" for why parameters have current values (complements fact authority table)
- **Town-Hermes Bridge (Spec 090)**: Decision memos should be shared with Town (Town agents need to understand context of decisions); feedback loop needed for Town findings to inform decision reviews

---

## Known Gaps and Next Steps

1. **Historical Decision Recovery**: Decisions 2026-04-06 (ranker v2) through 2026-04-04 (gates) are documented here retroactively. Missing earlier decisions (K=30, B6 weights, clinical v1/v2). Action: Backfill decision memos for all major parameters by 2026-06-01.

2. **Automation of Review Triggers**: Currently manual (weekly scan). Should be: Hermes agent automatically checks review trigger conditions (cohort Jaccard ≥0.70, 13F refresh complete, 60 days elapsed, etc.) and escalates. Action: Wire review trigger checks into fleet_steward agent.

3. **Decision Outcome Tracking**: Currently logs predicted impact but not observed impact. After review trigger fires, should measure: "Did the predicted impact materialize? Should we revisit the original decision?" Action: Post-decision-review checklist (measure actual vs predicted).

4. **Conflict Detection**: Multiple active decisions may have interdependencies or conflicts (e.g., clinical v2 NO_GO may change if inst_delta demotion clears cohort signal space). Should flag "Decision X is contingent on outcome of Decision Y." Action: Build decision dependency graph.

5. **Integration with Hermes Agent Prompts**: Agents should reference decision context when operating on parameters. Example: "fleet_steward, when monitoring Bellringer performance, note that 2026-04-28 decision to enable alerts depends on Herald digest stability. If Herald DARK, cannot evaluate alert SLA." Action: Wire decision context into agent initialization.

---

## Suggested Next Steps

1. **Immediate (May 18–19)**:
   - Review all ACTIVE decisions (6 above); confirm review triggers and owners
   - Check Decision 2026-05-04 (inst_delta demotion): review trigger date 2026-05-26 (13F refresh) — set calendar reminder
   - Backfill missing decisions: identify 3–5 historic decisions that lack memos; file them in `docs/decisions/`

2. **Short-term (May 19–26)**:
   - Link this Decision Audit Trail into GitHub repo (move to `docs/decision-audit-trail.md` or integrate into governance docs)
   - Create `docs/decisions/` directory; move all decision memos there
   - Set up weekly review trigger check (fleet_steward or calendar reminder)

3. **Medium-term (May 26–June 15)**:
   - Post-13F-refresh (May 26): Execute Decision 2026-05-04 review (is inst_delta IC recovered? should we reconsider demotion?)
   - Post-clinical-outcome-binding (June 1+): Execute Decision 2026-04-02 review (are clinical outcomes binding; can we measure Phase A criteria?)
   - Implement Decision 2026-04-28 (inst_delta shadow) verdict (verdict due h20d=2026-05-26)

4. **Integration with Hermes Agents**:
   - fleet_steward: "On Monday mornings, check Decision Audit Trail review triggers. Escalate if condition met."
   - ops_supervisor: "Maintain decision_audit_trail.md. File new decisions immediately. Sign off on proposed changes using 5-element governed path."
   - All agents: "When referencing a parameter or gate, consult Decision Audit Trail for rationale and review conditions."

5. **Ecosystem Integration**:
   - Link from Document Lineage Map (Fact Authority Table) to Decision Audit Trail (why does each fact have current value?)
   - Link from Failure Pattern Library (F-007, F-003, etc.) to Decision Audit Trail (resolution includes decision memo process)
   - Link from Operational Health Baselines (SLA thresholds) to Decision Audit Trail (review triggers may be SLA breaches)

