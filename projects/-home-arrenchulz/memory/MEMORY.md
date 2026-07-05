# Memory

> Index only — one line per memory; detail lives in the linked topic files. Status markers: `[active]` (default) · `[stale]` · `[shipped]` (in observation) · `[resolved]`. Query the graph before re-reading files: `query_memory_graph.py --search X` / `--related-to ID` / `--status stale` / `--orphans`. Rebuild after edits: `build_memory_graph.py`. Many resolved historical entries were collapsed 2026-07-05; their topic files remain on disk and are graph-discoverable.

## Pending / Active
- **[HS793 backfill incomplete — 49 tickers remain](project_hs793_backfill_reminder_2026_06_28.md)** `[active]` — quota hit 06-30, 296/345; retry IDs[300:], start_date='2024-01-01', ~1 batch.
- **[2026 forward splits not adjusted in drawdown feature — PR #475 MERGED](project_2026_forward_splits_unadjusted.md)** `[shipped]` — `run_screen._hydrate_drawdown` recent-split fallback restored RAW series → phantom deep drawdown for splits <126 post-split bars. IMMP wrongly excluded. Fix: corporate_actions scaling (commit `5dbb3680`); **PR #475 MERGED (`287a23de`)**. ⚠️ NOT live: shared checkout/cron doesn't auto-pull → deploy run_screen.py to shared checkout + re-run 07-03 → confirm IMMP eligible. See [[project-audit-split-adjust-fix-2026-07-05]].
- **[EES shadow monitor — raw_veto_core lead policy](ees_shadow_monitor_state_2026_06_23.md)** `[active]` — EES v3 = financing/overpricing false-positive detector; LEAD_POLICY=raw_veto_core (IC 0.064, t=2.36); daily shadow card; gates unmet.

## Freeze / Governance State — RECONCILED 2026-07-05
- **[Scoped production model freeze LIFTED 2026-06-24 (operator)](scoped_work_freeze_2026_06_22.md)** `[resolved]` — INC-2026-06-20 freeze lifted per repo commit `1e8a44ca` (operational-state.md), scoped to unblock Spec 100; no re-freeze after. ⚠️ Post-lift "freeze" (972db318/bc900928) = **DEM Top-30 candidate freeze + NO_MODEL_CHANGE forward-validation window** (different). Live gate for eligibility/ranker changes = the forward-validation window, NOT the INC freeze.
- **[Model investability verdict](project_model_investability_verdict_2026_06_26.md)** — Phase 3 substantially explained (regime offline during reconstructed BEAR); not cleared. Next gate: PHASE3_CORRECTED_REGIME_RANKING_REPLAY_DIAGNOSTIC.

## Recent fixes (shipped, in observation)
- **[Audit split-adjust fix — PR #474 MERGED](project_audit_split_adjust_fix_2026_07_05.md)** `[shipped]` — `data_integrity_audit.py` recomputed drawdown from RAW → false STALE_MISMATCH on split names (MLTX). Fix: `_split_adjust_prices` via corporate_actions; commit `30412bc2`, **PR #474 MERGED** (also not auto-live in shared checkout).
- **[Daily-run incident 07-02 — R² zerodiv + stale ipo_dates universe collapse](project_daily_run_2026_07_02_incident.md)** `[shipped]` — stale `ipo_dates.json` crosses 45-day PIT delist cutoff → universe silently collapses (314→13). Fix: `python3 tools/build_ipo_dates.py`. PR #454 + `52fe61d6`.
- **[Price-append MultiIndex bug — PR #453](project_price_append_multiindex_bug_2026_07_01.md)** `[shipped]` — yfinance MultiIndex cols corrupted 1 row/day; merged main 07-02 + deployed to shared checkout (commit `1c7dbdb2`).
- **[de_vol_60d gap — PR #456](project_data_quality_audit_2026_07_02.md)** `[shipped]` — 52/324 tickers lacked universe defensive_features; fixed in `_hydrate_beta_rsi` Step C + coverage_quality block. Merge `fdd3f6c8`.
- **[KYMR false sev3_gate — PR #455](reference_kymr_catalyst_misdate_2026_07_02.md)** `[shipped]` — 8-K "late 2027" mis-bucketed to 2026; fixed in `sec_8k_catalyst_collector.py` (merge `8c0d2af5`); self-corrects on re-parse.
- **[Options scope reset — Phase 1 diagnostic repair](options_scope_reset_phase1_2026_06_30.md)** `[shipped]` — priced_move_pct/MIN_OI/staleness/null-codes; Stage 1+2 MERGED PR #461 (`c3dd0def`); items 4+6 open. CNTA corp-action fix PR #460.

## Working-with-Claude lessons (durable)
- [Shared checkout — never edit code there; use a separate clone](feedback_shared_checkout_concurrency_2026_06_30.md) — concurrent Claude sessions + cron; worktree isolation unavailable (caller cwd not a git repo).
- [Default focus: daily DEM runs — no Robinhood trading unless explicitly requested](feedback_dem_focus_no_robinhood.md) — running an action card ≠ trade authorization.
- [Fork agents go runaway on multi-step tasks — never use fork for implementation](feedback_fork_agent_runaway_2026_06_24.md) — they make unauthorized commits per child completion.
- [Explore/general-purpose subagents have Bash — "read-only" not enforced](explore_agent_bash_write_risk_2026_06_22.md) — scope sweep prompts no-write/no-commit + verify via `git log`; treat self-reports as unverified.
- [Each step (markdown→design→script→run→commit→push→PR) needs its own explicit instruction](feedback_research_authorization_boundary.md) — feasibility/review authorization does NOT extend to code/runs/commits/PRs.
- [Doc updates must not import unreviewed/quarantined research outputs](feedback_doc_update_evidence_boundary.md).
- [biotech-snapshot-qa falsely flags market_data.json as missing](feedback_snapshot_qa_marketdata_falsepos.md) — it's a production_data input; verify via run_manifest.market_data_refresh.
- [Workflow tool is slow/token-heavy — avoid](feedback_workflow_tool_cost.md); [Hermes cron token bloat — 3 patterns](feedback_hermes_cron_token_bloat.md); [sync_hermes_skills all_sync_keys bug](feedback_sync_hermes_skills_bug.md).
- [Hermes scheduler: don't cron run+tick on paused jobs](hermes_scheduler_paused_job_safety_2026_06_22.md) — re-enables as side effect; use `hermes chat -q`.
- [Held-file precedence](feedback_held_file_precedence.md) — held instructions sticky; "commit and push" ≠ auto-include held files. [Pause between control-plane changes](feedback_pause_between_control_plane_changes.md). [Quarantine fixes need blast-radius diff](feedback_quarantine_blast_radius_diff.md).
- More feedback one-liners: [net-of-cost first](feedback_net_of_cost_reporting.md) · [DEM is book of record](feedback_dem_book_of_record.md) · [model doc location](feedback_model_doc_location.md) · [no formatter churn](feedback_no_formatter_churn_in_model_work.md) · [autonomy claims need evidence](feedback_autonomy_claims.md) · [agent governance: read-only judges/writers/human-only actions](feedback_agent_governance.md) · [coinvest is filter not alpha](feedback_coinvest_not_alpha.md) · [manager acceptance test — onboard_manager.py, never hand-edit](feedback_manager_acceptance_test.md) · [cohort-change quarantine](feedback_cohort_change_quarantine.md) · [no recursive supervision](feedback_no_recursive_supervision.md) · [verify sentinel verdict directly](feedback_verify_sentinel_verdict_directly.md) · [observation bias in cron monitoring](feedback_observation_bias_cron_monitoring.md) · [incomplete-run silent fallback → fake regime](incomplete_production_run_fallback_2026_05_01.md) · [audit-to-tickets prompt](feedback_audit_to_tickets_prompt.md).

## Validation Infrastructure (active)
- **[DEM model lesson — selection-under-stress edge; stress-wrapper shadow (PR #441)](project_dem_model_lesson_2026_06_28.md)** `[active]` — edge=quality/survivability convex selection; ⚠️ "strongest when bearish" conflicts with validated regime_bear t=1.69 (weakest) — reconcile before regime wiring.
- **[biotech-autopsy skill — PIT-clean YTD Top-30 failure post-mortem](project_biotech_autopsy_skill_2026_06_28.md)** `[active]` — price source `price_history_split_adj.csv`; writes `artifacts/autopsy/...`; 6 confirmed failure windows.
- **[YTD autopsy + shadow guards + regime monitor](project_biotech_autopsy_and_shadow_guards_2026_06_28.md)** `[active]` — 3 failure-mode monitors + DEM regime monitor; branch `research/failure-mode-shadow-guards-2026-06-28`; 5/20 windows; gates in `docs/SHADOW_GUARD_PROMOTION_GATES.md`.
- **[Rank-depth shadow — PR #436](project_rank_depth_shadow_2026_06_28.md)** `[shipped]` — Top-60 + ranks 31-60 cohorts; NO_MODEL_CHANGE; branch stacked on `prod/sharpen-…` (NOT main).
- **[hermes-skill-sync-agent — PR #423](project_hermes_skill_sync_2026_06_26.md)** `[active]` — 3-mode audit + wrapper + 8 tests; cron not yet registered.

## Agentic Portfolio Operations (active)
- **[Account 802349084 — live test case](project_agentic_portfolio_testcase_2026_06_24.md)** `[active]` — constraints: T+1 settlement, ~16-20 order/min, GFD-only fractional, $1 min, ABVX sell-only. Workflow: get_portfolio→positions→rankings.csv→delta→sells first→batched buys.
- **[Operational rules (confirmed 2026-06-24)](project_agentic_portfolio_rules_2026_06_24.md)** `[active]` — (1) weekly Mon rebalance + 25% drift; (2) entries next weekly, exits weekly unless rank<40; (3) EW until $5K then model weight; (4) hard exit ≤−2pp vs XBI → full liquidation; (5) IRAs independent/manual.
- 22 portfolio/ops skills installed in `~/.claude/skills/` (biotech-rebalance, -portfolio-status, -governance-check, -run-pipeline, -snapshot-qa, hermes-status, etc.).
- **[Live Robinhood execution 2026-06-10](robinhood_live_execution_2026_06_10.md)** — 15 names filled on 802349084 via MCP.

## Model Identity & Policy Anchors (frozen — durable)
- **[Production model identity [FROZEN]](scoring_model_identity_2026_04_06.md)** — coinvest selects + financial penalizes safe + inst_delta prunes; ranker v2 = 2-feat pairwise; ruleset `8887576e` (v1.14.0); A4 selector + EW Top-30; inst_delta_z zeroed in selector 2026-05-04.
- **[Alpha stack FROZEN](policy_alpha_freeze_2026_04_04.md)** — no promotions w/o Checklist v2 (FM+bootstrap+FDR+LOSO+year); pairwise ordinal-only (ECE 0.19), no rank-weighting. [Demotion path](policy_demotion_path_2026_05_06.md) = 5-element governed path, not a Checklist v2 promotion.
- **[Standing allocation policy](policy_allocation_2026_04_17.md)** — research 100% DEM; prod 30/70→60/40 DEM/XBI; XBI core; always report 3 series; promotion needs live evidence.
- **[Key signal evidence](signal_research_history.md)** — coinvest selector Δ+1.75pp t=3.05; inst_delta IC+0.077; B6 Δ+1.85pp t=3.56; clinical REJECTED; all pre-PIT-correction claims INVALIDATED.
- **[Historical backtest INVALIDATED (2026-04-17)](scoring_model_identity_2026_04_06.md)** — old PIT snapshots contaminated; forward monitoring = only valid evidence.
- **[Closed lanes](family_b_scrapped_2026_04_19.md)** — clinical as selector/ranker; options as alpha (Spec 053); static execution (054); Form 4 insider; total_volume_z; fixed sleeves; dynamic caps; rank-weighting; quality tiebreaks. [EES v3 structurally invalid](ees_v3_structural_failure_2026_04_30.md) — can't extract expectation error from expectation alone.
- [Coinvest = context layer not ranker](policy_coinvest_context_layer_2026_04_25.md); [freeze architecture, study behavior](policy_freeze_architecture_2026_04_19.md).

## Reference
- **[ISS document + iss-review skill](reference_iss_document.md)** — `~/.claude/docs/investment-strategy-statement.md`; skill `iss-review`.
- **[morningstar-benchmark skill](reference_morningstar_benchmark.md)** — 29 benchmarks, 10yr daily; `C:\Projects\morningstar`; MD_AUTH_TOKEN ~24h.
- **[Asset allocation model](asset_allocation_project_state.md)** — Wake Robin SFO; Phases 1–22 shipped (HEAD `0280024`, 391 tests); Phase 23 PE commitment-book deferred (pending user data).
- [User: Director of Investments, Wake Robin; CFA/CAIA; $14B+ background](user_profile_credentials_2026_05_15.md); [builder-writer-investor pattern; trust-under-uncertainty obsession](user_identity_pattern_2026_06_26.md).
- [RVMD+ERAS RAS thesis](research_rvmd_eras_ras_thesis_2026_04_28.md); [Data explorer canonical CLI](data_explorer_canonical_2026_04_13.md).
- Repo: `/mnt/c/Projects/biotech_screener/biotech-screener/` · Python 3.12.3 WSL2 (`--break-system-packages`) · ~358 tickers.

## Infrastructure (durable)
- PIT financials 339 tickers (`production_data/pit_financials/`); CRT auto-classifier + Herald; Event EV 6-layer Bayesian (`event_ev/`); PubMed NCBI (key in .env, 24h cache); Checklist v2 (`common/stats/`, 6 modules).
- [Ubuntu WSL2 verdict](infra_ubuntu_wsl2_verdict_2026_06_21.md) — stay Ubuntu; move repo off `/mnt/c`. [Codegraph pilot](codegraph_pilot_complete_2026_05_24.md) — Claude Code + Cursor MCP; 1668 files/50294 nodes. [CodeGraph/Hermes containment audit](codegraph_hermes_containment_2026_06_21.md).
- [WSL2 aarch64 — check wheels](env_wsl2_aarch64.md); [WSL uptime required 16:00-20:30 ET Mon-Fri for cron](env_wsl_uptime_required.md).
- [Semgrep governance guardrails](semgrep_governance_guardrails_2026_06_22.md) `[shipped]` — ERROR-blocking local pre-commit; slow on /mnt/c (scan on fast-fs copy). [Monte Carlo liquidity stress framework](monte_carlo_framework_built_2026_05_15.md) — 416 tests, synthetic/advisory.
- OpenClaw **RETIRED 2026-06-23**; Hermes primary orchestrator (gateway :8642). Run agents via `tools/run_agent_direct.py` after `source .env`. No cron may depend on a gateway token.

## LangGraph Orchestration Stack (LOCKED 2026-06-19)
- **[Stack summary + governance](langgraph_stack_summary_whdhbi.md)** — LG1 orchestrator (`1b2c8095`), LG2 approval (`bdb97db7`, review-only, automation immutably False), LG3 design (`a95f14a8`) + runtime (`0afa9e25`, READ_ONLY_DIAGNOSTIC, NON_BLOCKING). ⚠️ cron NOT persistently installed (dormant); observation checkpoint ~2026-07-03; no LG4/LG5 until checkpoint. Forbidden: cron/dashboard/production-hook/agent-summarization.

## Collapsed resolved clusters (topic files retained on disk)
- **Scientific Cartography** — Phases 3–13C all `[resolved]`, diagnostic-only, no production wiring. Latest: Phase 13C-lite export operational (commit `cfe07a77`); Phase 7A/7B wrappers committed (`57e665cf`/`365ef05d`); Phase 13A human validation PASS. Skill `sci-cart-run`. (see `scientific_cartography_*` files)
- **May-era specs (2026-05)** — 092 bioshort backfill, 093–099 ranking research, 100 IC-tooling correction (`2faa88e6`; measures final_score not composite), 102/104/105 closures — all resolved/shipped. Spec 095 IC-scope gap resolved by Spec 100. (see `spec_*` files)
- **13F Q1 2026 cycle** — cohort CLEARED 2026-05-24 (Jaccard 0.875); quarantine lifted; h20d override maintained (re-eval gate 2026-07-01). Managers: Fairmount/Deep Track/Logos. (see `13f_*` files)
- **Historical operational status (May–June)** — Path C closed 2026-06-24 (score_rank_pct IC +0.0432); containment INC-2026-06-20 lifted; universe hygiene → 358-ticker golden (PR #365/#366); yfinance rate-limit incident resolved (handler `scripts/yfinance_safe.py`). (see `path_c_*`, `containment_*`, `universe_hygiene_*`, `yfinance_rate_limit_*` files)
- **Hermes fleet history** — model migrations (DeepSeek→Llama fallback), skills hub sync (31 skills), gateway LAN fixes — mostly superseded by OpenClaw retirement. (see `hermes_*` files)
- **Firecrawl / Spec 062 options / Spec 063 intraday / EES v2** — all shipped, observation. (see respective topic files)

## Memory tooling
- Graph `memory_graph.json` built by `~/.claude/scripts/build_memory_graph.py`; query via `~/.claude/scripts/query_memory_graph.py`. Rebuild after edits. [Cleanup batch 1](memory_cleanup_batch1_2026_05_06.md).
