# Memory

> Index only — one line per memory; detail lives in linked topic files. Status: `[active]` (default) · `[stale]` · `[shipped]` (in observation) · `[resolved]`. Query graph before re-reading: `query_memory_graph.py --search X` / `--related-to ID` / `--status stale`. Rebuild after edits: `build_memory_graph.py`.

## Pending / Active
- **[Bluesky monitor agent — designed 2026-07-29](project_bluesky_monitor_agent_2026_07_29.md)** `[active]` — `agents/bluesky-monitor.md` + `skills/bluesky-monitor` + `scripts/bluesky_monitor.py`; observation-only; needs `BSKY_HANDLE` (+ optional app password) in `~/.claude/bluesky-monitor/config.env`.
- **[REVIEW FLAG: snapshot provenance hygiene (surfaced via 07-15)](project_snapshot_provenance_mismatch_2026_07_15.md)** `[active]` — CHRONIC not one-off: ~20 consecutive prod runs early-Jun→07-15 ran `dirty=True` and/or non-zero `screen_exit_code` (tolerated-by-design, `run_daily_production.py:667` = WARN+continue); cleared 07-16/17 w/ #499/#500+CTIS fixes. Re-run/quarantine of 07-15 DECLINED (arbitrary + backdated re-run = PIT contamination). Fix = forward gate (WARN, worktree+PR) + stop running prod from dirty checkout. See [[project_ctis_timeout_fix_2026_07_16]] · [[feedback_shared_checkout_concurrency_2026_06_30]].
- **[PKOS M2 activation (wake-robin-knowledge) — Item 9 OPEN](project_pkos_m2_activation_2026_07_17.md)** `[active]` — Items 1-8 evidence complete; 1/3 qualified promotion cycles (PR #10, `d3382b7`); M4 blocked; cron not authorized. Next cycle must be a separate-occasion, genuinely-useful promotion — see [[feedback_no_governance_theater_evidence]].
- **[DEM forward-validation hardening — SM-20260629-001](project_forward_validation_hardening_2026_07_10.md)** `[shipped]` — ast-v1 `827c35a9`; h20d=HOLD (Jaccard 0.463). 07-15: first v2 LIVE capture landed, ISO-wk-29 OPEN, realization ~07-22. CI RED on main (py3.10 f-string errors). Open: liveness cron install; untracked `keys.txt`; Sep-30 checkpoint.
- **[Camp Fimfo Waco demand monitor (Wake Robin)](project_campfimfo_waco_demand_monitor_2026_07_10.md)** `[active]` — `waco_monitor.py` at `/mnt/c/Projects/research/campfimfo-monitor/`; weekly WSL cron Mon 5pm ET. First snapshot: Waco ~27pts behind sister park.
- **[Hermes v0.17→v0.18 clean rebuild — DEPLOYED](project_hermes_0_18_clean_rebuild_2026_07_08.md)** `[shipped]` — branch `update/clean-0.18` (NOT main); fork backed up `fork-main-pre-0.18-backup`. Deferred: self-improve tools, .cursor, chown hooks.
- **[J&D entity study — AA Phase 24+26 COMPLETE](project_jd_entity_study_2026_07_07.md)** `[active]` — pipeline on main; JWB Trust=Jim's Trust alone. Authoritative build `jims_trust_full/` v2 (07-14, NAV $96.36M, 44.1% liq/30d, 22/22 oracle). Phase 26 purpose lens SHIPPED 07-15 (PR #18 `d1277dc`, 574 tests, 56/56 oracle) — 5 combined purpose groups, $8.55M to Growth+AG target. Optional: J&D-household roll-up.
- **[Morningstar Direct index-return ingestion — MERGED PR #8](project_morningstar_index_returns_2026_07_07.md)** `[shipped]` — 36-index file-based ingestion (main `df033ef`); workbook=trailing-return snapshot; 17 tests; live fetch deferred.
- **[HS793 backfill incomplete — 49 tickers remain](project_hs793_backfill_reminder_2026_06_28.md)** `[active]` — quota hit 06-30, 296/345; retry IDs[300:], start_date='2024-01-01'.
- **[2026 forward splits unadjusted in drawdown feature — PR #475 MERGED](project_2026_forward_splits_unadjusted.md)** `[shipped]` — fixed via corporate_actions scaling (`5dbb3680`). ⚠️ deploy to shared checkout + re-run to confirm IMMP eligible.
- **[Spec 062 expression-log dedup — MERGED + deployed 07-15](project_expression_log_dedup_2026_07_15.md)** `[resolved]` — PR #498; logs 39,216→12,896. Open observation: `resolve_attributions` never matched a record since April.
- **[CTIS warm timeout fix — PR #507 + heartbeat-path PR #508](project_ctis_timeout_fix_2026_07_16.md)** `[shipped]` — CTIS stale 06-24→07-16, fixed via detail-cache+900s budget; backfilled to age 0 (1657 recs, enrich 55s). Restart-storm was symptom of #499/#500 outage (stopped). Watchdog heartbeat-receipt path mismatch FIXED (#508, verified) — no more 30-min loop.
- **[EES shadow monitor — raw_veto_core lead policy](ees_shadow_monitor_state_2026_06_23.md)** `[active]` — financing/overpricing false-positive detector; IC 0.064 t=2.36; 20d gate MET 49/20 (veto alpha +8.2%), still FREEZE_ACTIVE. NO_CRON by design — cards produced by manual skill runs; skill doc's 17:50 cron claim is stale.
- **[forward_eval gate blind since April — fixed + CI follow-ups](project_forward_eval_gate_stale_2026_07_07.md)** `[shipped]` — PIT h20-backfill never wired, fixed default-on (PR #483); neg IC was metric artifact. Merged 07-08: #487/#486/#488. ⚠️ #485 still open; `operator_delivery` dedup bug flagged.
- **[HermesLink relay outage — traced & FIXED 2026-07-16](project_hermeslink_relay_outage_fix_2026_07_16.md)** `[shipped]` — bridge daemon dead since 07-15 (auto-update skipped restart, crash-looped); gateway itself healthy throughout. Fix: `hermeslink restart` — relay reconnected. Autostart/supervision gap still open.
- **[Town fleet-report quick-fix caveats (2026-07-16)](reference_town_fleet_report_fix_caveats_2026_07_16.md)** `[active]` — "uncomment CRT watcher"=DON'T (suppressed INC-2026-06-20 containment, sunset 09-30); "manager_registry 404"=Town-side, repo already correct. Verify report recs vs AGENT_REGISTRY.json before acting.

## Freeze / Governance State — RECONCILED 2026-07-05
- **[Scoped production model freeze LIFTED 2026-06-24](scoped_work_freeze_2026_06_22.md)** `[resolved]` — INC-2026-06-20 lifted per `1e8a44ca`, scoped to unblock Spec 100. ⚠️ Post-lift "freeze" (972db318/bc900928) = DEM Top-30 candidate freeze + NO_MODEL_CHANGE window (different thing) — that window is the live gate, not the INC.
- **[Model investability verdict](project_model_investability_verdict_2026_06_26.md)** — Phase 3 substantially explained (regime offline during reconstructed BEAR); not cleared. Next gate: PHASE3_CORRECTED_REGIME_RANKING_REPLAY_DIAGNOSTIC.

## Recent fixes (shipped, in observation)
- Collapsed 2026-07-10: [split-adjust PR #474](project_audit_split_adjust_fix_2026_07_05.md) · [daily-run 07-02 incident PR #454](project_daily_run_2026_07_02_incident.md) · [price-append MultiIndex PR #453](project_price_append_multiindex_bug_2026_07_01.md) (⚠️ recurred in `_safe` path) · [de_vol_60d PR #456](project_data_quality_audit_2026_07_02.md) · [KYMR sev3 PR #455](reference_kymr_catalyst_misdate_2026_07_02.md) · [options scope reset PR #461](options_scope_reset_phase1_2026_06_30.md).

## Working-with-Claude lessons (durable)
- [Shared checkout — never edit code there; use separate clone/worktree](feedback_shared_checkout_concurrency_2026_06_30.md) — concurrent sessions + cron; untracked files can vanish. Also [asset-alloc variant](feedback_asset_allocation_shared_checkout_2026_07_06.md).
- [Default focus: daily DEM runs — no Robinhood trading unless explicitly requested](feedback_dem_focus_no_robinhood.md).
- [Never use fork for implementation](feedback_fork_agent_runaway_2026_06_24.md) — fork agents make unauthorized commits.
- [Explore/general-purpose subagents have Bash — "read-only" not enforced](explore_agent_bash_write_risk_2026_06_22.md) — prompt no-write/no-commit + verify via `git log`.
- [Each pipeline step needs its own explicit instruction](feedback_research_authorization_boundary.md) — review authorization ≠ code/runs/commits/PRs.
- [Doc updates must not import unreviewed/quarantined research](feedback_doc_update_evidence_boundary.md).
- [biotech-snapshot-qa falsely flags market_data.json as missing](feedback_snapshot_qa_marketdata_falsepos.md) — verify via run_manifest.market_data_refresh.
- [Workflow tool slow/token-heavy](feedback_workflow_tool_cost.md) · [Hermes cron token bloat](feedback_hermes_cron_token_bloat.md) · [sync_hermes_skills bug](feedback_sync_hermes_skills_bug.md) · [don't cron run+tick paused jobs](hermes_scheduler_paused_job_safety_2026_06_22.md).
- [git-guardrail hook false-positives on written content — assemble strings at runtime or use Write tool](feedback_git_guardrail_content_falsepos_2026_07_15.md).
- [Don't manufacture artifacts to check a governance/milestone box — evidence of process must be genuine](feedback_no_governance_theater_evidence.md).
- [Held-file precedence](feedback_held_file_precedence.md) · [pause between control-plane changes](feedback_pause_between_control_plane_changes.md) · [quarantine fixes need blast-radius diff](feedback_quarantine_blast_radius_diff.md).
- More one-liners: [net-of-cost first](feedback_net_of_cost_reporting.md) · [DEM book of record](feedback_dem_book_of_record.md) · [model doc location](feedback_model_doc_location.md) · [no formatter churn](feedback_no_formatter_churn_in_model_work.md) · [autonomy claims need evidence](feedback_autonomy_claims.md) · [agent governance](feedback_agent_governance.md) · [coinvest is filter not alpha](feedback_coinvest_not_alpha.md) · [manager acceptance test](feedback_manager_acceptance_test.md) · [cohort-change quarantine](feedback_cohort_change_quarantine.md) · [no recursive supervision](feedback_no_recursive_supervision.md) · [verify sentinel verdict directly](feedback_verify_sentinel_verdict_directly.md) · [observation bias in cron monitoring](feedback_observation_bias_cron_monitoring.md) · [incomplete-run fallback → fake regime](incomplete_production_run_fallback_2026_05_01.md) · [audit-to-tickets prompt](feedback_audit_to_tickets_prompt.md).

## Validation Infrastructure (active)
- **[DEM model lesson — selection-under-stress edge; stress-wrapper shadow (PR #441)](project_dem_model_lesson_2026_06_28.md)** `[active]` — edge=quality/survivability convex selection; ⚠️ conflicts with validated regime_bear t=1.69 — reconcile before regime wiring.
- **[biotech-autopsy skill — PIT-clean YTD Top-30 failure post-mortem](project_biotech_autopsy_skill_2026_06_28.md)** `[active]` — price source `price_history_split_adj.csv`; 6 confirmed failure windows.
- **[YTD autopsy + shadow guards + regime monitor](project_biotech_autopsy_and_shadow_guards_2026_06_28.md)** `[active]` — 3 failure-mode monitors + DEM regime monitor; 5/20 windows; gates in `docs/SHADOW_GUARD_PROMOTION_GATES.md`.
- **[Rank-depth shadow — PR #436](project_rank_depth_shadow_2026_06_28.md)** `[shipped]` — Top-60 + ranks 31-60 cohorts; NO_MODEL_CHANGE.
- **[hermes-skill-sync-agent — PR #423](project_hermes_skill_sync_2026_06_26.md)** `[active]` — 3-mode audit + wrapper + 8 tests; cron not yet registered.

## Agentic Portfolio Operations (active)
- **[Account 802349084 — live test case](project_agentic_portfolio_testcase_2026_06_24.md)** `[active]` — T+1 settlement, GFD-only fractional, $1 min, ABVX sell-only. Workflow: get_portfolio→positions→rankings.csv→delta→sells first→batched buys.
- **[Operational rules (confirmed 2026-06-24)](project_agentic_portfolio_rules_2026_06_24.md)** `[active]` — weekly Mon rebalance+25% drift; EW until $5K then model weight; hard exit ≤−2pp vs XBI → full liquidation; IRAs independent/manual.
- 22 portfolio/ops skills installed in `~/.claude/skills/`.
- **[Live Robinhood execution 2026-06-10](robinhood_live_execution_2026_06_10.md)** — 15 names filled on 802349084 via MCP.

## Model Identity & Policy Anchors (frozen — durable)
- **[Production model identity [FROZEN]](scoring_model_identity_2026_04_06.md)** — coinvest selects + financial penalizes safe + inst_delta prunes; ranker v2=2-feat pairwise; ruleset `8887576e` (v1.14.0); A4 selector + EW Top-30.
- **[Alpha stack FROZEN](policy_alpha_freeze_2026_04_04.md)** — no promotions w/o Checklist v2; pairwise ordinal-only, no rank-weighting. [Demotion path](policy_demotion_path_2026_05_06.md) = separate 5-element governed path.
- **[Standing allocation policy](policy_allocation_2026_04_17.md)** — research 100% DEM; prod 30/70→60/40 DEM/XBI; always report 3 series.
- **[Key signal evidence](signal_research_history.md)** — coinvest selector Δ+1.75pp t=3.05; inst_delta IC+0.077; clinical REJECTED; pre-PIT-correction claims INVALIDATED.
- **[Historical backtest INVALIDATED (2026-04-17)](scoring_model_identity_2026_04_06.md)** — old PIT snapshots contaminated; forward monitoring = only valid evidence.
- **[Closed lanes](family_b_scrapped_2026_04_19.md)** — clinical as selector/ranker; options as alpha; static execution; Form 4 insider; fixed sleeves; rank-weighting. [EES v3 structurally invalid](ees_v3_structural_failure_2026_04_30.md).
- [Coinvest = context layer not ranker](policy_coinvest_context_layer_2026_04_25.md); [freeze architecture, study behavior](policy_freeze_architecture_2026_04_19.md).

## Reference
- **[wake-robin-knowledge repo](reference_wake_robin_knowledge_repo_2026_07_17.md)** — `Warrenpoobear/wake-robin-knowledge`, cloned to `/mnt/c/Projects/wake robin knowledge`; biotech/personal KB (companies, drugs, mechanisms, papers, journal); origin HTTPS; see [[project_pkos_m2_activation_2026_07_17]] for M2 status.
- **[ISS document + iss-review skill](reference_iss_document.md)** — `~/.claude/docs/investment-strategy-statement.md`.
- **[13F manager registry count = 55 (49 elite_core + 6 conditional), v3.2](reference_manager_registry_count_2026_07_14.md)** — BMIQ routine misreports 57; verify from JSON directly.
- **[morningstar-benchmark skill](reference_morningstar_benchmark.md)** — 29 benchmarks, 10yr daily; now a data feed (`morningstar_feed` + `datasets.json`).
- **[Morningstar Direct per-security trailing returns](reference_morningstar_direct_returns_workflow.md)** — resolve SecId via `investments()`, then `get_investment_data(data_points="0218-0037")`.
- **[Asset allocation model](asset_allocation_project_state.md)** — Wake Robin SFO; Phases 1–26 shipped (HEAD `d1277dc`, 574 tests, main synced); remote `WR-SW-Dev/WR-asset-allocation`, direct push OK; doc-as-spec `docs/MODEL_DOCUMENTATION.md`; Phase 23 PE commitment-book deferred.
- [User: Director of Investments, Wake Robin; CFA/CAIA; $14B+ background](user_profile_credentials_2026_05_15.md); [builder-writer-investor pattern](user_identity_pattern_2026_06_26.md).
- [RVMD+ERAS RAS thesis](research_rvmd_eras_ras_thesis_2026_04_28.md); [Data explorer canonical CLI](data_explorer_canonical_2026_04_13.md).
- Repo: `/mnt/c/Projects/biotech_screener/biotech-screener/` · Python 3.12.3 WSL2 · ~358 tickers.

## Infrastructure (durable)
- [AA repo CI greened + push constraints (2026-07-07)](aa_ci_green_and_constraints_2026_07_07.md) — push block RESOLVED 07-14, I can `git push` directly; `.github/` needs `workflow` OAuth scope.
- PIT financials 339 tickers; CRT auto-classifier + Herald; Event EV 6-layer Bayesian; PubMed NCBI (24h cache); Checklist v2 (`common/stats/`).
- [Ubuntu WSL2 verdict](infra_ubuntu_wsl2_verdict_2026_06_21.md) — stay Ubuntu; move repo off `/mnt/c`. [Codegraph pilot](codegraph_pilot_complete_2026_05_24.md) — 1668 files/50294 nodes.
- [WSL2 aarch64 — check wheels](env_wsl2_aarch64.md); [WSL uptime required 16:00-20:30 ET Mon-Fri for cron](env_wsl_uptime_required.md); [SSH keys: WSL passphrase-less / Windows passphrase-protected, unrecoverable](env_ssh_keys_2026_07_14.md).
- [Semgrep governance guardrails](semgrep_governance_guardrails_2026_06_22.md) `[shipped]` — ERROR-blocking pre-commit; slow on /mnt/c. [Monte Carlo liquidity stress framework](monte_carlo_framework_built_2026_05_15.md) — 416 tests.
- OpenClaw **RETIRED 2026-06-23**; Hermes primary orchestrator (gateway :8642, HermesLink bridges to relay — see [[project_hermeslink_relay_outage_fix_2026_07_16]]). Run agents via `tools/run_agent_direct.py` after `source .env`. No cron may depend on a gateway token.

## LangGraph Orchestration Stack (LOCKED 2026-06-19)
- **[Stack summary + governance](langgraph_stack_summary_whdhbi.md)** — LG1 orchestrator, LG2 approval (review-only), LG3 design+runtime (READ_ONLY_DIAGNOSTIC). ⚠️ cron dormant; no LG4/LG5 until checkpoint. Forbidden: cron/dashboard/production-hook/agent-summarization.

## Collapsed resolved clusters (topic files retained on disk)
- **Scientific Cartography** — Phases 3–13C all `[resolved]`, diagnostic-only. Skill `sci-cart-run`. (see `scientific_cartography_*`)
- **May-era specs (2026-05)** — 092–100/102/104/105 all resolved/shipped. (see `spec_*`)
- **13F Q1 2026 cycle** — cohort CLEARED 05-24 (Jaccard 0.875); h20d override maintained. (see `13f_*`)
- **Historical operational status (May–June)** — Path C closed; INC-2026-06-20 lifted; universe hygiene → 358-ticker golden; yfinance rate-limit resolved. (see `path_c_*`, `containment_*`, `universe_hygiene_*`, `yfinance_rate_limit_*`)
- **Hermes fleet history** — model migrations, skills hub sync, gateway LAN fixes — mostly superseded. (see `hermes_*`)
- **Firecrawl / Spec 062 options / Spec 063 intraday / EES v2** — all shipped, observation.

## Memory tooling
- Graph `memory_graph.json` built by `~/.claude/scripts/build_memory_graph.py`; query via `query_memory_graph.py`. Rebuild after edits. [Cleanup batch 1](memory_cleanup_batch1_2026_05_06.md). [Resolver hardening + dangling 106→0 (2026-07-07)](memory_graph_resolver_hardening_2026_07_07.md).
