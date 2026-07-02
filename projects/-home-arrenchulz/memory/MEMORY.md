# Memory

> Inline status markers: `[active]` (default, omitted) · `[stale]` (waiting on resolution) · `[shipped]` (in observation) · `[resolved]` (closed). New memory files use lifecycle frontmatter (`status`, `expires`, `resolves`, `supersedes`, `related`); old files are not retrofitted.

## Pending Reminders
- **[2026-07-02 daily run failure chain — R² zerodiv + stale ipo_dates.json universe collapse (FIXED)](project_daily_run_2026_07_02_incident.md)** `[shipped]` — Gotcha: stale `ipo_dates.json` crosses the 45-day PIT delist cutoff overnight → active universe silently collapses (e.g. 314→13) with no error. Symptom: `total_evaluated`/eligibility n_total tiny + `de_vol_60d` mostly missing. Fix: `python3 tools/build_ipo_dates.py`. Both fixes (PR #454 + ipo_dates) committed `52fe61d6`.
- **[Price-append MultiIndex bug — MERGED (PR #453) + deployed to shared checkout](project_price_append_multiindex_bug_2026_07_01.md)** `[shipped]` — yfinance MultiIndex cols → Series-repr ticker corrupted 1 row/day. Fix MERGED to main 2026-07-02 (PR #453, merge `0c76d195`, 78 tests). Cron does NOT auto-pull → deployed to shared checkout (foreign branch `fix/sync-hermes-skills-dual-map-drop`) AND made durable: committed the 2 fix files there (commit `1c7dbdb2`, staged only those 2 so concurrent session's uncommitted data files untouched) + pushed to remote. Fix now committed+pushed+working-tree-live. Data clean+fresh through 07-02. 07-01 snapshot regenerated on fresh prices: overbought RSI FAIL→WARN (46.6%→40.0%, 14→12 names).
- **[HS793 backfill incomplete — 49 tickers remain, retry 2026-07-01](project_hs793_backfill_reminder_2026_06_28.md)** `[active]` — Quota hit on final batch 2026-06-30. 296/345 current. Use IDs[300:], start_date='2024-01-01'. ~43k cells, 1 batch.

## Data-Quality Notes
- **[KYMR false sev3_gate — SEC 8-K "late <year>" readout mis-parse — FIXED PR #455 (2026-07-02)](reference_kymr_catalyst_misdate_2026_07_02.md)** `[shipped]` — 8-K "late 2027" bucketed into 2026 (unbounded `.*?` bridged across sentences + no late/early pattern). Extractor fixed in `sec_8k_catalyst_collector.py` (merge `8c0d2af5`, branch commit `3a4509e5`, deployed to working tree). Self-corrects on next EDGAR re-parse (07-03 run) for KYMR/ADCT/LXEO/RAPP; no cache surgery.

## Platform Roadmap (2026-06-22, corrected 2026-06-23)
- **[Operator-approved workstream sequence — 9/9 COMPLETE (2026-06-23)](platform_roadmap_2026_06_22.md)** — All items done. EES chain closed: validation→attribution→shadow monitor→guardrail design-only. Active path: daily shadow monitor run only. `OPENCLAW_STATUS: RETIRED`. Do not reopen any item.

## Freeze State (2026-06-22)
- **[Scoped work freeze — production model frozen, diagnostics unfrozen (2026-06-22)](scoped_work_freeze_2026_06_22.md)** `[active]` — Ranker/selector/sizing/final_score/portfolio frozen. EES shadow monitor now live (observation only). No model-use before shadow gates met (20 completed 5d + 20 completed 20d). See [[ees-shadow-monitor-state-2026-06-23]].
- **[EES shadow monitor — research complete, raw_veto_core lead policy (2026-06-25)](ees_shadow_monitor_state_2026_06_23.md)** — Research package done (6 scripts, 3 memos, commits 149c8f56/6123739c/0d47544f). EES v3 role = financing/overpricing false-positive detector. LEAD_POLICY=raw_veto_core (IC 0.064, t=2.36, LATE +7.1%); conditional veto rejected (fires too rarely). Daily shadow card being built. Gates still unmet.

## Containment Branch (2026-06-22)
- **[Containment branch pushed + draft PR #371 opened (2026-06-22)](containment_branch_status_2026_06_22.md)** `[resolved]` — PR #371 MERGED. OpenClaw fenced 2026-06-22 → RETIRED 2026-06-23. All containment items closed.

## Semgrep Governance Guardrails (2026-06-22)
- **[Semgrep governance guardrail layer — shipped 2026-06-22](semgrep_governance_guardrails_2026_06_22.md)** `[shipped]` — Draft PR #370 (rules: `0573101e`) + #371 (langgraph None-guard: `afced5d4`); 4/5 areas, §5 taint deferred; ERROR-blocking local pre-commit, WARN on-demand; CI dead so local-only. Gotchas: semgrep unusably slow on /mnt/c (scan on fast-fs copy), explicit targets bypass `.semgrepignore`, quoted-literal `pattern-not-regex` for field pins.

## Monte Carlo Framework (2026-05-15)
- [Monte Carlo liquidity stress framework — built 2026-05-15](monte_carlo_framework_built_2026_05_15.md) — MC-0/MC-1/MC-2/MC-3 delivered; 416 tests; synthetic/advisory, awaiting L19/L20/Phase-23 for decision-grade

## Working-with-Claude lessons
- [biotech-screener checkout is shared by concurrent Claude sessions + cron — never edit code there directly, use a separate clone (2026-06-30)](feedback_shared_checkout_concurrency_2026_06_30.md) — confirmed via reflog (foreign commit `80cf5a47` from another live session) + ps (2+ other claude processes); caused stash/revert confusion during options Stage 2 repair; worktree isolation unavailable in this environment (caller cwd not a git repo)
- [Default focus: daily DEM model runs — no Robinhood trading unless explicitly requested (2026-06-28)](feedback_dem_focus_no_robinhood.md) — Running an action card does not imply trade authorization; never invoke Robinhood execution tools unprompted
- [sync_hermes_skills.py all_sync_keys() bug — SKILL_MAP entry silently dropped (2026-06-26)](feedback_sync_hermes_skills_bug.md) — `{**SKILL_MAP, **REFERENCE_MAP}` merge drops SKILL_MAP entry when key appears in both; self-improving.md mirror never re-synced by main(); workaround: call sync_pair() directly
- [Hermes cron token bloat — 3 patterns + fixes (2026-06-25)](feedback_hermes_cron_token_bloat.md) — pre-loaded skills (`skill`/`skills` fields), sleep-cliff multi-firing (no idempotency guard), script-writing retry loops; Classes F/G/H in openclaw-cron-scheduler-debug
- [Fork agents go runaway on multi-step tasks — never use fork for implementation (2026-06-24)](feedback_fork_agent_runaway_2026_06_24.md) — forks re-notify per child completion, each cycle makes unauthorized commits; revert immediately if production data touched
- [Workflow tool is slow and token-heavy — avoid it (2026-06-23)](feedback_workflow_tool_cost.md) — use fork agents or direct sequential calls instead; workflows disabled in settings
- [Explore/general-purpose subagents have Bash — "read-only" isn't enforced (2026-06-22)](explore_agent_bash_write_risk_2026_06_22.md) — one auto-committed to the branch during a path-map sweep; scope sweep prompts with explicit no-write/no-commit + verify via `git log`; treat agent self-reports as unverified (confabulation)
- [Hermes scheduler: don't use cron run+tick on paused jobs (2026-06-22)](hermes_scheduler_paused_job_safety_2026_06_22.md) — re-enables as side effect; use hermes chat -q only
- [Doc updates must not import unreviewed/quarantined research outputs (2026-06-22)](feedback_doc_update_evidence_boundary.md) — backtest numbers and verdicts from analytical sessions landed in operational-state.md; quarantined outputs belong only as "quarantined, not accepted evidence" notes
- [Feasibility-review authorization does NOT extend to code, runs, commits, or PRs (2026-06-22)](feedback_research_authorization_boundary.md) — "proceed" after PR #381 was interpreted as authorization to write executable assembly code, run it, commit, push, open PR #382 — operator quarantined it; each step in markdown→design→script→run→commit→push→PR requires its own explicit instruction

## Investment Strategy Statement
- [ISS document + iss-review skill (2026-06-25)](reference_iss_document.md) — Markdown at `~/.claude/docs/investment-strategy-statement.md`; artifact at claude.ai; skill `iss-review` for display, exclusion checks, and coherence checks

## Options Infrastructure Scope (2026-06-30)
- **[Options scope reset — Phase 1 diagnostic repair only (2026-06-30)](options_scope_reset_phase1_2026_06_30.md)** `[active]` — EES/options divergence framing rejected (same circularity as EES v3, closed 2026-04-30); approved scope is audit/repair of priced_move_pct, MIN_OI enforcement, staleness, null reason codes; no selector/ranker/alpha path.

## Memory tooling
- Graph at `memory_graph.json` (next to this file) — built by `/home/arrenchulz/.claude/scripts/build_memory_graph.py`. Re-run after writing/editing memory files
- Query: `/home/arrenchulz/.claude/scripts/query_memory_graph.py --search X` / `--related-to ID` / `--status stale` / `--expires-before YYYY-MM-DD` / `--orphans` / `--summary`. Use BEFORE re-reading multiple memory files

## LangGraph Orchestration Stack — LOCKED (2026-06-19)
- **[LG3 cron ACTIVATED (2026-06-19) — ⚠️CORRECTED 2026-06-22](langgraph_lg3_cron_activated_2026_06_19.md)** `[stale]` — Claim was wrong: cron NOT persistently installed (`no crontab`), only 4 runs ever, dormant since Jun 21. See integrity check below.
- **[LG3 runtime wrapper LOCKED (0afa9e25)](langgraph_lg3_runtime_wrapper_locked_0n5ax6.md)** — MODE_B_CRON_COMPATIBLE, READ_ONLY_DIAGNOSTIC, NON_BLOCKING. Wrapper COMPLETE; cron installation ACTIVE.
- **[LG3 wrapper vs cron](langgraph_lg3_wrapper_vs_cron_o3e6bw.md)** — Wrapper ready; cron installation ACTIVE; observation window LIVE.
- **[LG3 observation period (2026-06-19–07-03)](langgraph_lg3_observation_period_9zu55z.md)** — Verify wrapper runs, audit appends, non-blocking fails, artifacts bounded. Checkpoint ~2026-07-03. No LG4/LG5 until checkpoint.
- **[LangGraph stack summary](langgraph_stack_summary_whdhbi.md)** — LG1 (1b2c8095) orchestrator, LG2 (bdb97db7) approval, LG3 design (a95f14a8), LG3 runtime (0afa9e25).
- **[LG2 governance boundaries (2026-06-19)](langgraph_phase_lg2_governance_boundaries.md)** — Review-workflow-approval-only (never automation). automation_approval immutably False. Append-only JSONL artifacts. **Forbidden**: cron, dashboard, production hook, agent summarization. LG3 runtime requires separate approval from LG2 approval.

## Skill Sync Agent (2026-06-26)
- **[hermes-skill-sync-agent shipped — PR #423 open (2026-06-26)](project_hermes_skill_sync_2026_06_26.md)** `[active]` — 3-mode audit tool + wrapper + 8 tests; Correction Ledger refs removed from self-improving; 0 CRITICAL on first run; cron NOT yet registered (awaiting PR merge + operator action)

## Model Investability Verdict
- **[Model investability verdict — updated 2026-06-26](project_model_investability_verdict_2026_06_26.md)** — Phase 3 substantially explained: regime offline during reconstructed BEAR (VIX 15–22, XBI −5% to −14% vs SPY). Not yet cleared. Next gate: PHASE3_CORRECTED_REGIME_RANKING_REPLAY_DIAGNOSTIC_NO_MODEL_CHANGE

## Validation Infrastructure
- **[DEM model lesson — selection-under-stress edge; stress-wrapper shadow built (2026-06-28)](project_dem_model_lesson_2026_06_28.md)** `[active]` — edge=quality/survivability convex selection, failure=repeat-offender/event-premium; ranker frozen, shadow wrapper (PR #441); ⚠️ "strongest when bearish" conflicts with validated regime_bear t=1.69 (weakest) — reconcile before regime wiring

- **[Rank-depth shadow tracking shipped — PR #436 (2026-06-28)](project_rank_depth_shadow_2026_06_28.md)** `[shipped]` — Top-60 + ranks 31-60 cohorts alongside Top-30 forward validation; NO_MODEL_CHANGE; commits 10cae69e+18b5094e on `feat/rank-depth-shadow` (based on `prod/sharpen-…`, NOT main — stack ~37 commits ahead of main); non-blocking `rank_depth_top60.csv` sidecar; cron promotion deferred. Gotcha: PR stacked feature work → target actual parent branch, not main.
- **[biotech-autopsy skill — self-improving forensic attribution (2026-06-28)](project_biotech_autopsy_skill_2026_06_28.md)** `[active]` — `~/.claude/skills/biotech-autopsy/SKILL.md`; PIT-clean YTD Top-30 failure post-mortem; 6 confirmed failure windows (worst: Mar-16, May-26→Jun-2 cluster); price source `production_data/price_history_split_adj.csv`; writes to `artifacts/autopsy/ytd_top30_failure_postmortem_2026/`; Lessons Learned section updates after each run.
- **[YTD autopsy + shadow guards + regime monitor deployed (2026-06-28)](project_biotech_autopsy_and_shadow_guards_2026_06_28.md)** `[active]` — 7 windows analyzed, 4/6 avoidable; 3 failure-mode shadow monitors + DEM regime monitor (RALLY/NON_RALLY/mono/conc) on branch `research/failure-mode-shadow-guards-2026-06-28` (commits ddfa5c17+05a963df+62750714); 5/20 windows accumulated; promotion gates in `docs/SHADOW_GUARD_PROMOTION_GATES.md`.

## Morningstar Benchmark Data
- **[morningstar-benchmark skill — 29 benchmarks, 10yr daily returns (2026-06-30)](reference_morningstar_benchmark.md)** — `C:\Projects\morningstar` + `github.com/Warrenpoobear/morningstar` (private); skill `morningstar-benchmark` for refresh/status; MD_AUTH_TOKEN ~24h TTL; 3 not in API: Govt/Credit 1-5, HY Muni, Credit Suisse HF

## Agentic Portfolio Operations
- **[Agentic account 802349084 — live test case for Claude-managed biotech portfolio (2026-06-24)](project_agentic_portfolio_testcase_2026_06_24.md)** `[active]` — Test case for building rules/skills/memories for live portfolio management. Validated constraints: T+1 settlement gap, ~16-20 order/min rate limit, GFD-only for fractional orders, $1 order minimum, ABVX sell-only. Rebalance workflow: get_portfolio → positions → rankings.csv → delta → sells first → batched buys.
- **[Agentic portfolio operational rules — confirmed 2026-06-24](project_agentic_portfolio_rules_2026_06_24.md)** `[active]` — 5 standing rules: (1) weekly Monday rebalance + 25% drift trigger; (2) new entries at next weekly, exits at weekly unless rank<40; (3) equal weight until $5K then model weight; (4) hard exit ≤-2pp drawdown vs XBI → full liquidation; (5) IRAs independent/manual only.
- **[Portfolio + ops skills — 22 skills installed 2026-06-24]** — Portfolio (11): `biotech-rebalance`, `biotech-portfolio-status`, `biotech-roster-check`, `biotech-ira-review`, `biotech-hard-exit`, `biotech-governance-check`, `biotech-ira-trade`, `biotech-performance-report`, `biotech-position-research`, `biotech-new-entry`, `biotech-morning-brief`. Pipeline/model (5): `biotech-run-pipeline`, `biotech-snapshot-qa`, `biotech-ic-check`, `biotech-ees-monitor`, `biotech-weekly-sweep`. Infra (4): `hermes-status`, `hermes-chat`, `cron-status`, `yfinance-check`. Other (2): `sci-cart-run`, `asset-alloc-status`. All in `/home/arrenchulz/.claude/skills/`.

## Operational Status (June 4 – ongoing)
- **[Containment LIFTED + fleet reactivated (2026-06-22)](containment_lifted_reactivation_2026_06_22.md)** `[active]` — INC-2026-06-20-AUTOPUSH containment DROPPED by operator override (branch protection WAIVED — impossible on free plan; push risk accepted). Hermes gateway up (:8642), OpenClaw kept (:19001, the supervised executor), crontab restored (49 jobs), LG3 cron reinstalled + nodes.py bug fixed. ⚠️ `weekly-skill-harvester` auto-push-to-main vector RE-ARMED. Repo-history cleanup (runbook §6) NOT run. Durable note in governance package.
- **[Hermes fleet integrity check (2026-06-22)](hermes_fleet_integrity_2026_06_22.md)** `[active]` — Migration INCOMPLETE: OpenClaw still LIVE runtime (gateway :19001 pid 7171, active SQLite WAL); Hermes gateways DOWN. Fixed researcher `.env` dup port 8642→8644 (no restart). LG3 cron NOT installed. 2 integrity-report false positives corrected. agents_direct/snapshot/LG3 reinstall all gated on containment.
- **[Hermes self-improvement loop STAGED (2026-06-21)](hermes_selfimprove_staging_2026_06_21.md)** `[active]` — Closes reward-signal + auto-promotion gaps; 5 files at `~/hermes_selfimprove_staging/` OUTSIDE frozen repo; gated on containment gates; scanner validated read-only (16 LRN→2 promotable)
- **[Hermes fleet status — 2026-06-19](hermes_fleet_status_2026_06_19.md)** — 11 OK / 2 WARN / 2 FAIL; three critical blockers: (1) agents_direct cron dead since Jun 03 (cascading 5-agent staleness), (2) calibration_evidence FAIL (17d, postmortem gap upstream), (3) production_qa RED (run_manifest missing, classifier pool threshold breach). No new regressions. Next action: unblock agents_direct cron, resolve calibration_evidence, fix production_qa gates.
- **[Phase 7A operational validation COMPLETE (2026-06-17)](phase7a_operational_validation_complete.md)** `[resolved]` — Tested on golden/baseline_2026-02-20 snapshot (319 companies). All 9 artifacts generated correctly; status.json valid; governance locked. Wrapper handles missing inputs gracefully (non-blocking). Ready for standalone operational use. Phase 7B preflight executed and implementation complete (commit 365ef05d).
- **[Phase 7B preflight checklist (2026-06-17)](phase7b_preflight_checklist.md)** `[resolved]` — Preflight verification COMPLETE before Phase 7B implementation. Insertion point identified (Step 4.5, after snapshot promotion). All 9 checklist items verified: orchestration flow, integration point, existing patterns, failure handling, draft plan approved. Phase 7B now COMMITTED at 365ef05d. Checklist reusable template for future integration phases.
- **[Scientific Cartography Phase 7B production hook COMMITTED (2026-06-17)](scientific_cartography_phase7b_committed_2026_06_17.md)** `[resolved]` — Disabled-by-default hook at commit 365ef05d. 208/208 tests PASS (194 Phase 0-7A + 14 Phase 7B). Hook: Step 4.5 after snapshot promotion. Non-blocking by default; strict mode available. CLI flags: --run-scientific-cartography, --scientific-cartography-strict. Output: artifacts/scientific_cartography/{date}. NO production wiring, NO cron, MANUAL ACTIVATION ONLY. Ready for operational activation or Phase 7B integration decision.
- **[Scientific Cartography Phase 7A diagnostic wrapper COMMITTED (2026-06-17)](scientific_cartography_phase7a_complete.md)** `[resolved]` — Standalone wrapper locked at commit 57e665cf. 194/194 tests PASS (186 Phase 0-6 + 8 Phase 7A). `tools/run_scientific_cartography_diagnostics.py` orchestrates builders/exporters, generates 9 diagnostic artifacts + status.json. Cache-only, non-blocking, no production wiring. **OPERATIONALLY_READY_AS_STANDALONE_TOOL**.
- **[Scientific Cartography Phase 6.1 scope locked (2026-06-17)](phase6_1_scope_boundaries.md)** — CLI ergonomics only: export-artifacts command, input/output/date arguments, progress summary. **NOT included:** pipeline integration (Phase 7), rankings export, cron wiring, scoring changes, LangGraph, UI. Tight boundary: no architectural integration in Phase 6.1. Phase 7 decision gate after 1-2 weeks operational use.
- **[Scientific Cartography Layer v0.1 Phase 6 COMMITTED (2026-06-17)](scientific_cartography_v0_1_phase6_locked.md)** `[resolved]` — Artifact export layer baseline locked at commit 0058b940 (fix + Phase 6). 178/178 tests PASS. MapIndexExporter + DiseaseMapExporter + ArtifactManifestExporter. Operational review CLEAN: unknown preservation working, feature gating working, source_refs tracked, governance compliant. **READY_FOR_PHASE_6_1_CLI**. Fix: MapIndexExporter None-handling in sort (edge case from unknown diseases).
- **[Scientific Cartography Layer v0.1 Phase 5 COMMITTED (2026-06-17)](scientific_cartography_v0_1_phase_5_committed.md)** `[resolved]` — Landscape features diagnostic baseline locked at commit 2b6a5e22. 161/161 tests PASS (141 Phase 0-4 regression + 20 Phase 5 new). LandscapeFeatureRecord + LandscapeFeatureBuilder for computing count structures and diagnostic scores (mechanism/stage crowding, white-space proxy). Deterministic feature IDs via SHA256. Transparent score formulas (weighted stage counts, conservative gating for unknown disease/mechanism). Feature confidence tracking. Coverage report diagnostic-only. Governance: READ_ONLY_DIAGNOSTIC, LANDSCAPE_FEATURES_DIAGNOSTIC_ONLY, no portfolio interpretation/alpha claims, no production wiring, cache-only, point-in-time safe.
- **[Scientific Cartography Layer v0.1 Phase 4 COMMITTED (2026-06-17)](scientific_cartography_v0_1_phase_4_committed.md)** `[resolved]` — Competitive clustering baseline locked at commit 9c7067fb. 141/141 tests PASS (118 Phase 0-3 regression + 23 Phase 4 new). CompetitiveClusterRecord + CompetitiveClusterBuilder for deterministic grouping by disease|mechanism|modality|target. Count-structure only: program counts, public/private split, stage distribution. Deterministic cluster IDs via SHA256. Coverage report diagnostic-only (no scoring). Governance: READ_ONLY_DIAGNOSTIC, COUNT_STRUCTURE_ONLY, no crowding/white-space/differentiation scores, no landscape features yet, cache-only, point-in-time safe, no LangGraph/production wiring.
- **[Scientific Cartography Layer v0.1 Phase 3 COMMITTED (2026-06-17)](scientific_cartography_v0_1_phase_3_committed.md)** `[resolved]` — Mechanism/modality normalizer baseline locked at commit 9abb79c1. 118/118 tests PASS (87 Phase 0/1+2 regression + 31 Phase 3 new). MechanismNormalizer class with ~30-entry mechanism/modality/target dictionary, exact/alias/substring matching, manual CSV override, conservative matching (no inference from disease/company), ambiguity preservation, confidence scoring. 20 mechanism tests + 11 program enrichment tests. Governance: READ_ONLY_DIAGNOSTIC, PASS_THROUGH_DIAGNOSTIC_ONLY (no scoring integration), no ranker/selector/sizing/final_score changes, cache-only, unknown preservation, point-in-time safe. Boundary clean: no clusters, crowding/white-space, LangGraph, production wiring.
- **[Biotech containment + governance package (2026-06-21)](biotech_containment_governance_2026_06_21.md)** `[active]` — INC-2026-06-20-AUTOPUSH; **freeze baseline MOVED 2026-06-22: main d9531c7b→b096cfe7 (operator merged PRs #359–#364; ⚠️ no CI — Actions budget exhausted)** (remote SSH; gh now authed). Durable 8-doc package OUTSIDE repo at `~/governance_package_2026_06_21/`. Gates open: BRANCH_PROTECTION_ENABLED / ALL_AGENTS_CLOSED / QUIESCENCE_CONFIRMED_TWICE. Sequence A(operator)→B✅→C cleanup→D July8→E v3. Central Q: ranks within cohort or just selects? (U2 co-primary). Principle: repo control ≠ model validity ≠ capital authorization.
- **[Universe hygiene branch (2026-06-21)](universe_hygiene_branch_2026_06_21.md)** `[active]` — corp-actions (RNA/APLS/KALV/TERN/THRD gated) + ETF parser + 16 ETF adds. **PR #365 MERGED to main 2026-06-22 → 354-ticker universe now GOLDEN on main (e304654d).** 4 IPO adds (KLRA/PBLS/GENB/KARD→358) committed `5e068773`, in follow-up DRAFT PR #366 (NOT yet on main); merge gated by no-CI + containment. Eligible: 354→343, with #366 →347.
- **[Open-PR triage (2026-06-22)](biotech_open_pr_triage_2026_06_22.md)** `[active]` — MERGED to main (no CI ran): #359–364 (test/CI), #365 (hygiene→354), #366 (IPO adds→358), #367 (--as-of fix). **main now e51d4ded, 358-ticker universe golden** (4 IPO adds as bare stubs). Data enrichment for the 4 in DRAFT #368. #338/#270 closed; #268 keep(gated)/#267 redo/#269 park. 🚩 Free-plan blocks: no Actions minutes + branch protection impossible. ⚠️ Operator auto-merges PRs in minutes (branch auto-delete strands follow-ups). ⚠️ Live watcher edited snapshot_generator.py mid-session (now fixed via merged #367).
- **[Hermes containment shutdown (2026-06-21)](hermes_update_2026_06_21.md)** `[active]` — Supersedes 06-12. Fleet to be CLOSED per ALL_AGENTS_CLOSED after INC-2026-06-20-AUTOPUSH; health NOT polled (polling is gated); repo frozen at d9531c7b. Do not restart fleet until containment gates clear (BRANCH_PROTECTION_ENABLED / ALL_AGENTS_CLOSED / QUIESCENCE_CONFIRMED_TWICE).
- **[Hermes update & escalation (2026-06-12)](hermes_update_2026_06_12.md)** `[stale]` — Superseded by 06-21. Fleet health: 13/29 OK, 2 WARN, 1 FAIL. Critical: ic_health_monitor clinical_optionality_pct_dev ALERT (mean_ic=-0.0338, backwards signal). Fixed: policy_shadow gap (8d, now regenerated). ops_supervisor ORANGE verdict (investigate). Cron verified healthy (PID 225). Phase 2 gates all passing. Briefing at artifacts/ops_supervisor/2026-06-12_escalation_briefing.md
- **[Live Robinhood agentic trade EXECUTED (2026-06-10)](robinhood_live_execution_2026_06_10.md)** `[active]` — 15 biotech screener names (COGT/DNTH/NRIX/URGN/ALMS/SYRE/RVMD/CMPS/SLDB/DRUG/STOK/PRAX/TRVI/ERAS/XENE) + $100.19 notional + all 15 filled on agentic account 802349084; real MCP execution (place_equity_order/review_equity_order); daily monitoring 2026-06-11 through 2026-06-30
- **[Phase 2 unblocking COMPLETE (2026-06-05)](phase2_unblocking_complete_2026_06_05.md)** `[resolved]` — SEC 8K using Option B (stale June 1 cache); Module 5 composite design-as-intended; June 4 snapshot ready (298 holdings, COGT/DNTH/NRIX top 3); daily monitoring can proceed
- **[Phase 2 daily monitoring checklist (2026-06-05)](phase2_daily_monitoring_checklist_2026_06_05.md)** — Pre-market/intraday/post-trading checks; governance gate verification (Drawdown/IC/Jaccard/Emergency); Layer B signal review; 15-20 min/day effort; daily Mon-Fri through ~2026-06-17
- **[Biotech test suite COMPLETE (2026-06-05)](biotech_test_run_2026_06_05.md)** — 16,537 tests, 99.95% pass (16,358 passed, 8 failed); core functionality ✅ healthy; 8 known failures in guardrails (4), agent registry (2), classifier (1), IC memory (1); production-ready; documented in commit a5c531e7
- **[Hermes gateway LAN fixes RESOLVED (2026-06-05)](hermes_gateway_lan_fixes_2026_06_05.md)** — lmstudio binding changed 127.0.0.1→0.0.0.0; Telegram conflict resolved; both gateways now LAN-accessible on 8643/8642; documented in `HERMES_GATEWAY_CONFIG.md` (commit 934bac41)
- [Path C decision COMPLETE (2026-06-03)](PATH_C_DECISION_LOG_2026_06_03.md) — EXTENDED until ~2026-06-17; all monitoring gates wired and operational

## Operational Status (May 19 – June 3)
- **[CRITICAL: 2026-06-01 snapshot QUARANTINED (2026-06-01)](canonical_snapshot_2026_06_01_failure.md)** — Composite aggregation failed (0.06–0.10 scores despite normal components); Phase 2 SUSPENDED_PENDING_COMPOSITE_AGGREGATION_DIAGNOSIS; 2026-05-29 reference only (not authorized replacement Day 1)

- [IC health monitor ALERT explanation (2026-05-19)](ic_health_monitor_alert_explanation_2026_05_19.md) — 13F ingest ✓ FRESH (42 managers as of 05-19); ALERT is lagging historical IC, not system failure; real test May 20–22 post-13F refresh
- [Hermes model migration — DeepSeek v4 flash (2026-05-20)](hermes_model_migration_deepseek_2026_05_20.md) — Fleet migrated to `deepseek/deepseek-v4-flash:free`; gateway config fixed 2026-05-25 (was falling back to Llama 3.3 70B); **check Together AI balance before Monday**
- [Hermes MCP hardening + CI fixes (2026-05-25)](hermes_mcp_ci_fixes_2026_05_25.md) — PATH guard in hermes-mcp-serve; mcp.json env vars + environment.json for Cursor Cloud; CI paths-ignore to stop doc-only budget burn; core.fileMode false on all 4 repos
- **[yfinance rate-limit incident + recovery (2026-05-23 to 2026-05-26)](yfinance_rate_limit_incident_2026_05_23.md)** — 429 rate-limit on all 341 tickers 2026-05-23 14:00 ET; 4-day outage (0 fresh snapshots May 23-26); root cause: yfinance lacks built-in backoff; **RESOLVED:** rate-limit handler deployed (`scripts/yfinance_safe.py`), production recovered with May 22 snapshot, monitoring active (every 30 min), awaiting API reset
- [Hermes status post-recovery (2026-05-26)](hermes_status_2026_05_26.md) — Fleet stable; production operational (stale); rate-limit handler deployed; monitoring active every 30 min; awaiting yfinance API reset (expected 24-72h from incident)
- **[Governance state clarification (2026-05-26)](governance_state_2026_05_26.md)** — 13F quarantine ✓ CLEARED (Jaccard 0.875), h20d ✗ DEFERRED (Path B), Spec 089 advisory-only, alpha freeze active, Phase 2 Step 5 blocked
- **[h20d override decision (2026-05-26)](h20d_override_decision_2026_05_26.md)** — Freeze ✓ LIFTED (manual override despite failed 13F validation), Phase 2 Step 5 ✓ UNBLOCKED, Spec 089 ✓ ACTIVATED; weekly monitoring + re-eval gate 2026-07-01
- **[Governance decision: Path C approval (2026-05-28)](governance_decision_path_c_2026_05_28.md)** — Catalyst timing policy override APPROVED (0-30d up to 40-45%, 91-180d at observed levels); time-bounded through 2026-06-03 IC window; Path A (durable gates) mandated post-freeze; 49-manager institutional data confirmed as real consensus
- **[Path C operational setup COMPLETE (2026-05-28)](path_c_operational_setup_complete.md)** — Daily monitoring checklist deployed (`tools/daily_path_c_monitoring.sh`); window close automation ready (`tools/path_c_window_close_decision.py`); IC_UNOBSERVABLE scenario expected (cold-start); first IC prints ~2026-06-17; operator decision on 2026-06-03: extend or revert
- **[Hermes OpenRouter rate-limit (2026-05-27)](hermes_openrouter_rate_limit_2026_05_27.md)** — FREE tier `deepseek/deepseek-v4-flash:free` HTTP 429 rate-limited; all queries fallback to Together Llama 3.3 (10.7s latency); OPENROUTER_API_KEY not set; need to add key OR switch primary to Together
- **[Hermes OpenRouter fallback — operational (2026-06-01)](hermes_openrouter_fallback_decision_2026_06_01.md)** — User decision: keep free tier + Together fallback; no API key upgrade planned; monitoring: 30-min yfinance checks + agent latency tracking
- **[Hermes OpenRouter endpoint offline — RESOLVED (2026-06-01)](hermes_openrouter_endpoint_offline_2026_06_01.md)** — deepseek/deepseek-v4-flash:free unreachable; switched primary to together/meta-llama/Llama-3.3-70B-Instruct-Turbo; production restored
- **[Hermes skills status — 31 skills, clean audit (2026-05-31)](hermes_skills_status_2026_05_31.md)** — 31 Hermes docs, 31 registered in _meta.json, 16 SKILL_MAP, 12 HERMES_NATIVE (docs-only); no drift detected; memory-steward authoritative; operator layout at `docs/hermes_agents/operator_host_skills.md`
- **[Phase 2 Day 1 official start (2026-06-01)](phase2_day1_official_start_2026_06_01.md)** — Day 1 locked 2026-06-01 with 2026-06-01 snapshot (30 holdings); baseline artifacts (holdings, performance, staleness, turnover, attribution) captured; daily tracking now authorized; governance checkpoints at ~30/60/90 trading days
- **[Path C monitoring restored (2026-06-01)](path_c_monitoring_restored_2026_06_01.md)** — Drawdown vs XBI metric fully operational (commit b87d9a8d); monitoring locked Day 1 portfolio only; hard exit gate: ≤-2.00pp; ready for June 3 decision (extend IC window or revert to HOLD)
- **[PATH_C_WINDOW_CLOSE_DECISION_2026_06_03.md (governance artifact)](../../../../../../../mnt/c/Projects/biotech_screener/biotech-screener/artifacts/readiness/PATH_C_WINDOW_CLOSE_DECISION_2026_06_03.md)** — Decision memo: IC_UNOBSERVABLE (expected), 13F Jaccard 0.875 (stable), drawdown monitoring live; **recommendation: EXTEND until ~2026-06-17** (first observable IC); Options A (extend) + B (revert); checklist for operator
- **[Top-30 classifier scoring impact audit (2026-06-02)](top30_classifier_impact_audit_2026_06_02.md)** — Catalyst fields UNTRUSTED for RVMD/CELC (suppressed Phase 3) + ERAS/DRUG/ALKS (collision noise); MBX clean; Phase 2 Day 1 locked (safe); forward catalyst actions BLOCKED pending remediation lanes
- **[Broader classifier misclassification scan (2026-06-02)](broader_classifier_misclassification_2026_06_01.md)** — Systemic quality issues: 47.6% collision rate, 81.2% needs_review rate across 78 tickers; COGT (rank 1) all-flagged; 26 non-Top-30 tickers with >50% collision; advisory-only for new tickers until baseline fixed

## Identity Pattern
- **[Builder-writer-investor pattern + private cathedral risk (2026-06-26)](user_identity_pattern_2026_06_26.md)** — Attention > résumé: builder-writer-investor in practice, investor-builder-writer on paper. Core obsession = trust under uncertainty, not biotech. Permission-system behavior (needs the model to confirm what he already believes). Compressed style as armor. Needed conversion: private cathedral → public instrument. Key test: does the week's work produce a decision, publishable writing, or externally legible artifact?

## Professional Profile
- [Director of Investments at Wake Robin; CFA/CAIA (updated 2026-05-25)](user_profile_credentials_2026_05_15.md) — Wake Robin = real estate investment + community dev co; DEM biotech screener = parallel investment research capability; $14B+ institutional background; dschulz@wakerobin.co / djschulz@gmail.com

## Personal Position Research
- [RVMD + ERAS RAS thesis (2026-04-28)](research_rvmd_eras_ras_thesis_2026_04_28.md) — RVMD de-risked leader (P3 OS hit 04-13); ERAS satellite, binary H1 2027

## Asset Allocation Model
- [Project state + next move (2026-05-05)](asset_allocation_project_state.md) — Wake Robin SFO; Phases 1–22 + 14.3 shipped, all on `origin/main` (HEAD `0280024`, 391 tests); L20 RESOLVED, L19 PARTIALLY (pending human row classification); Phase 23 design locked; 2026-05-05 external-review triage pushed (8 fixes)
- [External review outcome (2026-05-05)](asset_allocation_external_review_2026_05_05.md) `[shipped]` — 8 findings (path-traversal, hash gaps, TA wind-down, recon div-by-zero, fund_count cap, overlay paths, config strictness, runway horizon) → all fixed in 3 commits → HEAD `0280024`; regression tests at `tests/test_review_fixes_2026_05_05.py`
- [Phase 23 PE commitment-book — deferred](asset_allocation_phase_23_followup.md) `[stale]` — design at `f81ff43`; implementation waiting on user-gathered commitment book + Archway monthly actuals + entity registry; resumption order: EntityRegistry → fixtures → loader → diagnostics

## Infrastructure
- [Ubuntu WSL2 verdict (2026-06-21)](infra_ubuntu_wsl2_verdict_2026_06_21.md) — stay on Ubuntu; move repo `/mnt/c/` → `~/Projects/`; small VPS for always-on cron; no distro switch
- **[CodeGraph/Hermes containment audit (2026-06-21)](codegraph_hermes_containment_2026_06_21.md)** `[shipped]` — index.lock races = WSL2 `/mnt/c` latency, NOT live watcher (per-repo daemon dead, ENOTSUP socket); Hermes MCP gateway instance A (passive, Cursor-launched) reaped by closing Cursor; reversible Cursor-MCP disable patch DRAFTED + UNAPPLIED (apply only if Cursor auto-respawns Hermes)

## Dev Tools
- [Hermes skills inventory (2026-06-02)](hermes_skills_inventory_2026_06_02.md) — 31 active skills (6 governance, 6 signal, 7 ops, 3 liquidity, 3 research, 4 debug, 2 office); Phase B complete; audit CLEAN; Path C monitoring + town-operator-bridge live
- **[Hermes skills optimization framework (2026-06-05)](hermes_skills_optimization_framework.md)** — Recursive self-improvement system for 31 skills: execution logging + dependency mapping + feedback learning + monthly reports; enables skill efficacy scoring, composition pattern mining, auto-suggestion
- **[Hermes skills logging integration — Safe v2 (2026-06-05)](hermes_skills_logging_integration_plan.md)** — Production-safe logging with redaction, env tagging, min sample sizes, advisory-only recommendations, 7-day observation period, operator approval required; integration timeline June 5-12, observation June 12-19
- **[Hermes skills Phase 2 operational status (2026-06-05)](hermes_skills_phase2_ops_2026_06_05.md)** — 31 skills deployed across 3 layers; Layer A/C operational, Layer B (8 signal monitors) restored post-trading 18:00-18:20 ET; 7 governance-critical skills armed; market-data-dependent skills healthy; phase 3-blocked skills correctly inactive; logging baseline established
- [Codegraph pilot complete (2026-05-24)](codegraph_pilot_complete_2026_05_24.md) — Claude Code + Cursor MCP approved (callers/callees/trace); validated 2026-05-25 (both MCP servers pass); Hermes registration DEFERRED; index 1,668 files/50,294 nodes

## Biotech Screener
- **[Ranker contract test-hardening (2026-06-21)](ranker_contract_test_hardening_2026_06_21.md)** `[resolved]` — **MERGED to main as PR #364 (2026-06-22, merge c09bf1e2); ⚠️ no CI ran (Actions budget exhausted)**; 49/49 tests local; pins 2-feat minimal_v2 artifact + deployed weights/bias + 0.0001 non-cohort fallback + 8887576e coinvest-only ruleset. TEST_CONTRACT_ONLY. Next ranker lane = diagnostic/shadow IC only.
- **[Production pipeline status as of 2026-06-18](production_pipeline_status_2026_06_18.md)** `[resolved]` — Phase 13C-lite operational, 338-ticker universe 99.5% complete (265 companies, 86 sectors, 3 financial backfilled), daily pipeline tested (25 artifacts), all governance gates passing, ready for portfolio construction.
- **[Scientific Cartography Phase 9 OPERATIONAL_READY (2026-06-17)](scientific_cartography_phase9_committed_2026_06_17.md)** `[resolved]` — Diagnostic reference layer wrapping ProgramRecords with Phase 8 disease ontology enrichment. AssetIndicationMapRecord (24 fields) + AssetIndicationMapBuilder + coverage report. 15/15 tests PASS. Governance: read-only diagnostic, no production changes. Deduplication by record_id. Commits 20e522fd (impl) + 94905388 (validation). Operational validation PASS: 5 programs, 5 records generated, 4 MONDO-mapped, governance locked.
- **[Scientific Cartography Phase 9 FINAL LOCK (2026-06-17)](scientific_cartography_phase9_final_lock_2026_06_17.md)** `[resolved]` — Diagnostic reference layer SEALED. AssetIndicationMapRecord (24 fields) + builder + validation tool. 257/257 tests PASS (full suite). Boundary: read-only diagnostic, no ranker/selector/sizing/score changes. Commits 20e522fd + 94905388. Operational validation PASS. Production safety verified. Ready for Phase 10 cluster enhancement.
- **[Scientific Cartography Phase 10 cluster enhancement COMMITTED (2026-06-18)](scientific_cartography_phase10_cluster_enhancement_committed_2026_06_18.md)** `[resolved]` — Diagnostic-only cluster enrichment with MONDO disease mapping. EnhancedCompetitiveClusterRecord + builder. 278/278 tests PASS (21 Phase 10 + 257 prior). Grouping by mondo_id|mechanism|target|modality, count structures only. Deterministic SHA256 cluster_id. Governance: READ_ONLY_DIAGNOSTIC, no scoring/ranking/selector/sizing changes. Commit 38021215. Operationally ready as diagnostic layer.
- **[Scientific Cartography Phase 11 landscape context COMMITTED (2026-06-18)](scientific_cartography_phase11_landscape_context_committed_2026_06_18.md)** `[resolved]` — Diagnostic-only context enrichment. LandscapeContextFeatureRecord + builder. 301/301 tests PASS (23 Phase 11 + 278 prior). One feature per asset-indication record with disease/mechanism/stage competition counts and novelty/evidence/crowding categories. Deterministic SHA256 feature_id. Governance: READ_ONLY_DIAGNOSTIC, CONTEXT_FEATURES_ONLY, no scoring/ranking changes. Commit 63ec66c2. Separate layer from Phase 5; ready for Phase 12.
- **[Scientific Cartography Phase 12 disease map artifacts COMMITTED (2026-06-18)](scientific_cartography_phase12_disease_map_artifacts_committed_2026_06_18.md)** `[resolved]` — Per-disease diagnostic export layer. DiseaseMapArtifactExporter + 22 tests. 323/323 tests PASS (22 Phase 12 + 301 prior). Safe slug generation, per-disease JSON/CSV/MD artifacts, disease index. Governance: READ_ONLY_DIAGNOSTIC, artifact export only, no scoring/ranking/selector/sizing. Commit 8d2f2757. Operationally ready as diagnostic artifact layer.
- **[Scientific Cartography Phase 13A review runbook COMMITTED (2026-06-18)](scientific_cartography_phase13a_runbook_2026_06_18.md)** `[resolved]` — Documentation: quick start, review protocol (health check → sample → coverage → boundary verification), interpretation guide, workflow example, known limitations, escalation paths. Authority: read-only human-centered review. NOT: cron, production wiring, scoring integration. Status: DOCUMENTATION_ONLY, NO_AUTOMATION, READY_FOR_MANUAL_REVIEW.
- **[Scientific Cartography Phase 13A human validation COMPLETE (2026-06-18)](phase13a_human_validation_complete_2026_06_18.md)** `[resolved]` — Phase 13A runbook validated. Real disease maps reviewed: 5 diseases (Type 2 Diabetes, Atopic Dermatitis, Lymphoma, Breast Cancer, NSCLC) from 2026-06-10 snapshot. 71,284 programs, 6,760 diseases, 6,794 clusters. All 9 operational gates PASS. Workflow proven useful, governance maintained, data quality validated. Recommend Phase 13B decision (dashboard/automation). Status: READY_FOR_PHASE_13B_DECISION.
- **[Scientific Cartography Phase 13C-lite APPROVED (2026-06-18)](scientific_cartography_phase13c_lite_decision_2026_06_18.md)** `[resolved]` — Diagnostic artifact generation (not production deployment). Decision: APPROVE_13C_LITE / DEFER_13B_DASHBOARD / DEFER_14_MECHANISM_TARGET. Scope: manifest + size guard + forbidden-field scan. Manual trigger first, cron optional later. Status: READY_FOR_PHASE_13C_LITE_IMPLEMENTATION.
- **[Phase 13C-lite execution OPERATIONAL (2026-06-18)](phase13c_lite_execution_operational_2026_06_18.md)** `[resolved]` — Export script fully operational. Manifest ✓, size guard ✓, forbidden-field scan ✓ (improved context detection). 333/333 tests PASS. Ready for `--run-scientific-cartography-phase13c` activation.
- **[Scientific Cartography Phase 13C implementation COMPLETE (2026-06-18)](scientific_cartography_phase13c_implementation_complete_2026_06_18.md)** `[resolved]` — Phase 13C automated disease map export COMMITTED; disabled-by-default hook for routine artifact generation. Commit cfe07a77.
- **[Layer B agent reactivation (2026-06-05)](layer_b_reactivation_2026_06_05.md)** — Signal monitors (price_action_watch, catalyst_delta, options_watch, ic_health_monitor, grok_biotech_watch) re-enabled post-trading 18:00-18:20 ET Mon-Fri; observational outputs only, no portfolio authority; restores Phase 2 situational awareness without altering governance constraints; verified working 2026-06-05
- **[Phase 1b Infrastructure Integration — ACCEPTED (2026-06-03)](phase_1b_acceptance_2026_06_03.md)** — Scheduler health + Herald CircuitBreaker + IC memory hygiene + shadow attribution downgrade; 4 commits, 15/15 tests PASS; scoped to infrastructure only, no ranker/selector changes; workspace has 14 unrelated untracked exploratory artifacts
- **[SEC 8K data collapse investigation (2026-06-03)](sec_8k_failure_investigation_2026_06_03.md)** — Snapshot blocked; safety safeguard working correctly. Collapse detected: 118 events (June 2-3) vs 497 (June 1), ratio 0.24 < threshold 0.30. No code changes since May 29; issue is external (SEC API or data). Operator action: diagnostic SEC API check required; Options A (use stale cache) / B (relax threshold) / C (investigate) available post-diagnosis
- **[Herald darkness resolved (2026-06-02)](herald_darkness_resolved_2026_06_02.md)** — Digest pipeline stalled 2026-05-26 (no cron entry); root cause fixed; cron 8:05 AM ET wired; first digest sent 2026-06-02 ✓
- [Snapshot write chain corrected (2026-05-24)](biotech_snapshot_write_chain_2026_05_24.md) — `run_batch` orchestrates both `run_screen_for_date` + `_write_snapshot`; output root is `data/snapshots_pit/` not `data/snapshots/`; two files written per date
- **[Firecrawl research-only adapter (2026-05-27)](firecrawl_research_integration_2026_05_27.md)** — Research tool for biotech news discovery (commit 899595ad); governance-enforced; search/scrape with source tracking; output to artifacts/research/firecrawl/; ready for daily research consumption, no ranker inputs
- **[Firecrawl daily cron COMPLETE (2026-05-27)](firecrawl_daily_cron_setup_complete_2026_05_27.md)** — Three jobs: 8 AM (morning), 2 PM (full pipeline), 4 PM (intraday enrichment); API key in .env; env export fixed (set -a/+a); commit 47f9ca2e; validation window 2026-05-27 → 2026-06-17

- `/mnt/c/Projects/biotech_screener/biotech-screener/` · Python 3.12.3 WSL2 (`pip --break-system-packages`) · 341 tickers · `specs/changes/` (110+)
- **[Spec 110 Phase 1 PoC complete (2026-05-21)](spec_110_phase_1_poc_complete_2026_05_21.md)** — Provenance graph implementation: 56 nodes, 16 edges, 5 query patterns, 22 tests (100% PASS); 2026-05-20 snapshot lineage artifact generated; phase 1 boundaries met (design locked, no production wiring)
- **[Knowledge graph strategic roadmap (2026-05-19)](knowledge_graph_strategic_roadmap_2026_05_19.md)** — Selective KG application for governance (not alpha). Priority: (1) Spec 089 governance KG ✅, (2) Spec 110 pipeline provenance (design 2026-05-19, PoC 2026-05-21 ✅), (3) Feature provenance, (4) 13F cohort, (5) Agent/cron ops. **Hard boundary:** No KG-derived scores or graph centrality as alpha.
- **[Architecture optimization: Hermes as operating layer (2026-05-15)](architecture_optimization_2026_05_15.md)** — Three lanes (deterministic + cheap escalation + manual), token policy, preflight checklist; Phase 1 docs committed (routing policy, preflight, token budget); Phase 2–5 roadmap: registry metadata → preflight tool → evening cron audit → Spec 089 KG → KG gating
- **[Phase 2 Step 3: Evening reliability audit + watchdog COMPLETE (2026-05-15)](phase_2_step_3_evening_reliability_complete_2026_05_15.md)** — Root cause: WSL cron invocation failure (19:30–19:40 window); morning catch-up watchdog deployed (09:15 ET cron); May 12–15 backfilled; verification May 16–19; Phase 3b (preflight integration) ready post-May-19
- **[Phase 2 Step 3b: Preflight integration COMPLETE (2026-05-15)](phase_2_step_3b_preflight_integration_complete_2026_05_15.md)** — agent_preflight wired into run_agent_direct; blocking/warning/non-blocking modes; 5/5 tests PASS; commits `f29f53ed` + `c5da6870`; ready for Phase 4
- **[Phase 2 Step 4: KG implementation COMPLETE (2026-05-21)](phase_2_step_4_complete_2026_05_21.md)** — 4a (loader, 17 tests) + 4b (queries, 10 tests) + 4c (contradictions, 12 tests) + 4e (integration, 13 tests) = 68/68 PASS; Phase 1 PoC (22 tests) also complete; h20d ready; 4d (CLI) deferred post-h20d
- **[h20d Phase 2 Step 4 Evidence READY (2026-05-21)](h20d_phase_2_step_4_evidence_2026_05_21.md)** — 52/52 tests PASS (post-commit hygiene clean), C0 guard coverage verified, architecture validated, blocked on 13F quarantine verdict (May 23–26) + h20d decision (May 26)
- **[h20d Decision Memo Framework (2026-05-21)](h20d_decision_memo_framework_2026_05_21.md)** — Evidence collection (May 21–26), decision options (freeze-lift approve/defer/hybrid), 13F clearance gate, Phase 2 Step 5 implementation timeline
- **[h20d Decision Memo DRAFT (2026-05-21)](h20d_decision_memo_draft_2026_05_21.md)** — Full memo ready for finalization May 25–26; 3 decision paths, contingencies, success criteria; finalized with 13F verdict
- **[Phase 2 Step 4: KG sprint LOCKED (2026-05-15)](phase_2_step_4_sprint_locked_2026_05_15.md)** — Original design spec; all 5 components (4a–4e) designed; 4a–4c+4e shipped May 21, 4d deferred
- **[Operational closure: 2026-05-15 snapshot QA + implementation halt](operational_closure_2026_05_15.md)** — Snapshot PASS; Specs 104/105 closed; **13F cohort quarantine STILL ACTIVE** (6/48 filed); inst_delta_z distortion NOT cleared; no ranker/selector/sizing work authorized; Spec 089 deferred pending cohort validation (~May 23–26)
- [Event analyst rebuilt 2026-05-13](event_analyst_rebuilt_2026_05_13.md) — 174 postmortems; CLINICAL 53% hit T+1/52% T+5; Tier D strong T+1 (64%) but weak T+5 (36%); shadow outperforms 52%/61% vs 51%/53% nonshadow
- [Phase 2 supervisor decision 2026-05-05 (resolved)](phase2_supervisor_decision_2026_05_05.md) — YELLOW verdict; 2 known exceptions (inst_delta inflated until 13F ~05-15, shadow_monitor WARN) both carried; no action, watch only
- [Stabilization checkpoint 2026-05-08](biotech_stabilization_checkpoint_2026_05_08.md) — 4 commits; IC first read OBSERVE (pooled IC=-0.031, post-cohort=-0.008); **stop on model logic** until 13F refresh (~05-15) + h20d=2026-05-26 both clear
- [Spec 071 + 078 catalyst hygiene closed (2026-05-06)](spec_071_078_catalyst_hygiene_closed_2026_05_06.md) `[shipped]` — `c08b6062`+`02f10a76` on origin/main; `.gitignore` narrowed to `artifacts/audit/*.md`; 147 tests; monitor-only, no scoring change
- [Spec 092 bioshort backfill — all phases shipped (2026-05-13)](spec_092_phase_d_complete_2026_05_13.md) `[resolved]` — A: design; B: `47041a6f`+`08d14c3a` (--research-mode isolation); C: `34902dbb` (146/146 snapshots→panel); D: `3e8ac686` (forward returns T+1/5/20, DEFER 60.5% hit T+5); pseudo-PIT caveat; no promotion path
- [Morningstar fix pending snapshot (2026-05-06)](morningstar_fix_pending_snapshot_2026_05_06.md) — two key-path bugs fixed (`e70ae626`, `5c284ab7`); smoke 297/299; live check on next production snapshot; expected ms_return_ytd ≥290/299 → FIXED_AND_LIVE
- [Postmortem detection fix (2026-05-02)](postmortem_detection_fix_2026_05_02.md) — 80 April backfill; transition-based detection; cron 18:33; calibration_evidence validation 2026-05-08
- [Spec 105 live QA closure (2026-05-14)](spec_105_closure_2026_05_14.md) `[resolved]` — all 4 expectation fields ≥thresholds (short_interest 98.3%, close_price 100%, market_cap 100%, priced_move 83.6%); commit `c6bcb91c`
- [Spec 104 Phase A closure (2026-05-14)](spec_104_insider_stabilization_phase_a_2026_05_14.md) `[shipped]` — insider diagnostic coverage measurement; commit `b98ffbac`; 4 trading days measured (100% nonblank, 0.00% variance); Phase B awaits 2026-05-15 snapshot
- [Spec 102 Phase A shipped (2026-05-14)](spec_102_historical_backfill_2026_05_14.md) `[shipped]` — backfill script + 13 tests; commit `18cd13b1`; ready for execution on 19 snapshots (2026-04-20 through 2026-05-13)
- [Spec 102 execution closure (2026-05-14)](spec_102_execution_closure_2026_05_14.md) `[resolved]` — 19 snapshots backfilled; coverage gates PASS; closure memo committed `b8df2663`; --force flag reserved/no-op
- [Specs 104/105 closure sequence (2026-05-15 snapshot)](specs_104_105_closure_sequence_2026_05_15.md) — QA check + insider measurement commands; close conditions for both specs
- [Production run 2026-05-15 complete](production_run_2026_05_15.md) — snapshot ready 09:47 UTC, **QA PASS** (drift PASS, ruleset PASS, phase 2 OK), Spec 104 Phase B PASS (5d/0.0pp variance), ev_severity working, post-snapshot supervisor PASS (10:36 UTC); commit `3185d752`
- [PIT cache idempotent](biotech_pit_cache_idempotent.md) — refreshing `production_data/trial_records.json` won't propagate; also delete `cache/ctgov/trial_records_{date}.json`
- [Staging-vs-canonical-root bug class](biotech_staging_vs_canonical_root_bug_class.md) — `snap_path.parent` ≠ `data/snapshots/`; use `_prior_dir`. 3 sites patched 2026-04-30; sweep pending
- [Active ranker contract registry (2026-05-14)](biotech_ranker_active_contract_2026_04_30.md) — branch unapplied; manual enforcement accepted 2026-05-13; audit updates complete 2026-05-14; defer merge to post-h20d (2026-05-26)
- [Ranking alternatives research (2026-05-08)](ranking_alternatives_research_2026_05_08.md) — 10 alts; 3 HIGH_POTENTIAL_BUT_BLOCKED (3/4/6); 3 NO_GO (7/8/9); financial_score sign [CRITICAL T8-E1]; IC tool bug (full universe not top-60); PROMOTION_ELIGIBLE 2027
- [Ranking methodology spec backlog (2026-05-13)](ranking_methodology_spec_backlog_2026_05_13.md) — 7 specs (093-099): financial_score audit ✓, selector-only baseline ✓, top-60 scope ✓, gate/ranker separation ✓, event-EV monitoring ✓, catalyst timing monitor ✓, clinical orthogonality ✓. All descriptive/research; no implementation. Specs 093-099 completed; Spec 100 governance follow-up created.
- [Governance: IC evidence hold (2026-05-13)](governance_ic_evidence_hold_2026_05_13.md) — Spec 095 audit found IC backtest measures composite_score, not ranker final_score. Do NOT use prior IC evidence for promotion until Spec 100 tool fix. Specs 093/094/095 audits remain valid; IC claims deferred. Governance enforced via memory.
- [Hermes skills audit 2026-05-15](hermes_skills_audit_2026_05_15.md) — Complete audit of 19 skills; all current, 5 screener skills updated (Specs 092–105), critical Spec 095 IC scope gap identified
- [Hermes skills hub sync 2026-05-24](hermes_skills_hub_sync_2026_05_24.md) — 15 docs committed to `docs/hermes_skills/` (`f3ab726b`); 7 new skills installed in hub (`654172c06`): dossier-gen, validation, browser-automation, self-improving, pe-pacing, sfo-liquidity-arch, spending-liquidity; 7 existing canonicals preserved (11–35KB each)
- **[Hermes agent skills operational status (2026-05-26)](hermes_agent_skills_status_2026_05_26.md)** — Fleet: 27 agents stable on DeepSeek v4 flash; Layer A (6 data ingestion) + Layer B (8 signal monitors) + Layer C (7 control plane); incident impact: 9/27 stale (awaiting yfinance API reset); recovery: 2/27 recovered (data_auditor, postmortem); monitoring active; ETA full recovery 2026-05-27 to 2026-05-28
- [Town-Hermes bridge delivery targets](town_hermes_bridge_delivery_targets.md) — djschulz@gmail.com (personal) + dschulz@wakerobin.co (work); Phase A dry-run complete; Phase B live delivery not started; feedback protocol frozen post-h20d
- [Spec 095 IC scope gap](spec_095_ic_scope_gap_critical.md) `[resolved]` — Root cause (tool measured composite_score not final_score) fixed by Spec 100 (2026-05-17); prior ranker IC claims invalidated; corrected final_score baseline ready
- **[Spec 100 IC tooling correction RESOLVED (2026-05-17)](spec_100_ic_tooling_correction_complete_2026_05_17.md)** — default signal → final_score; metadata labels spec_100_status; composite_score IC marked INVALIDATED; Commit 2faa88e6 (rebased); next: read-only smoke artifact, deferred interpretation post-freeze
- **[Operating state post-Spec 100 (2026-05-17)](operating_state_post_spec_100_2026_05_17.md)** — Blockers, priorities, next actions (13F monitoring, Phase 2 verification, smoke artifact, KG pilot post-clearance, IC dashboard post-freeze); Town AI H1 fix included
- **[Spec-drift remediation: Town AI H1 COMPLETE (2026-05-17)](spec_drift_remediation_town_ai_complete_2026_05_17.md)** — Verified runtime bug fix: Module 4 clinical_score denominator 120→117; execution_score max 22 causes total max 117; max ceiling 97.5→100.0; commit 3ad7b904; tests 27/27 pass; branch pushed
- **[Session close: PR #288 + Spec 100 monitoring (2026-05-17)](session_2026_05_17_pr288_spec100_monitoring.md)** — PR #288 CI classified pre-existing; Spec 100 smoke baseline ready (deferred interpretation); 13F/Phase 2/KG blocked until May 19–26 gates; closed session, monitoring state only

## Data Explorer canonical (2026-04-13)
- [Data explorer canonical](data_explorer_canonical_2026_04_13.md) — console summaries non-authoritative · CLI `python -m tools.data_explorer {summary,compare,qa,catalog,field,top-n,daily}`

## Production Model Identity (2026-04-06) [FROZEN] — see `scoring_model_identity_2026_04_06.md`
- coinvest selects + financial penalizes safe + inst_delta prunes. Inst block = 92.7% of selector variance; clinical block = 0
- Ranker v2 = 2-feat pairwise. Live = capped Family C (`coinvest_score_z` +0.02, `financial_score` -0.0533); `production_data/ranker_v2_model.json` provenance is authoritative
- Ruleset `8887576e` (v1.14.0; was `2a3e79eb` v1.13.0 until 2026-05-04 demotion of `inst_delta_z` per `policy_demotion_path_2026_05_06.md`); A4 selector + 2-feat ranker; EW Top-30; financial_score = Module 5 rank-norm, NOT raw M2
- Active fields enforced by `common/ranker_active_contract.py` (see registry memory above)
- [Forward-return test prod vs coinvest (2026-05-01, n=8)](forward_return_test_prod_vs_coinvest_2026_05_01.md) — INCONCLUSIVE: prod median +0.31pp vs coinvest-eligible, sign-test 4/8, rescued-vs-suppressed differential +0.10pp ≈ 0. Coinvest does main work; ranker deviations unproven but not clearly harmful. Re-run 2026-05-22.

## ALPHA STACK FROZEN (2026-04-04) — see `policy_alpha_freeze_2026_04_04.md`
- No promotions w/o Checklist v2 (FM + bootstrap + FDR + LOSO + year stab). Pairwise = ordinal only (ECE=0.19); no rank-weighting; ranker frozen at 2 features
- [Demotion path clarification (2026-05-06)](policy_demotion_path_2026_05_06.md) — signal removals under confirmed degradation are NOT Checklist v2 promotions; require 5-element governed path: two-frame evidence + comparator probe + Spec-style writeup + operator sign-off + receipt/changelog
- [Ranker research landscape (2026-05-14)](ranker_research_landscape_2026_05_14.md) — Spec 072 frozen candidate pending 2026-05-22 verification; Spec 091 warning-governance; Spec 096 doctrine governs all changes; no production ranker changes authorized until evidence/blockers satisfied
- [Spec 089 Phase 1.5A — Ranker governance KG pilot](spec_089_phase_1_5a_ranker_governance_kg_pilot.md) `[stale]` — schema design locked on main (`8bee00e4`); 11 node types + 15 edge types + 5 contradiction rules; **implementation DEFERRED** (2026-05-15) pending 13F cohort clearance; resume condition: cohort Jaccard ≥0.70 + distortion cleared (~2026-05-23+); commit `3185d752`
- [2026-05-22 ranker review framing](2026_05_22_ranker_review_framing.md) — **INTERIM GOVERNANCE BRIEFING ONLY** (2026-05-15 update); no production ranker change authorized; 13F cohort quarantine still active; key decision gates open post-h20d (2026-05-26) if cohort clears; commit `3185d752`
- [Spec 105 closure (2026-05-14)](spec_105_closure_2026_05_14.md) `[resolved]` — all expectation fields ≥thresholds; insider diagnostic-only confirmed; commit `c6bcb91c`

## Architecture frozen — study live (2026-04-19)
- [Freeze architecture, study behavior](policy_freeze_architecture_2026_04_19.md) — audit live A4 + 2-feat ranker; attribution only; per-snapshot, not cross-snapshot

## Coinvest = context layer not ranker (2026-04-25)
- [Coinvest context layer](policy_coinvest_context_layer_2026_04_25.md) — target for next ranker retrain; do NOT strip without audited replacement; interaction grid is alpha lane

## Post-cohort-change regime (2026-04-28 → ~2026-05-15)
- [Inst_delta inflated, do NOT fix](regime_post_cohort_change_distortion_2026_04_28.md) — 04-25 added 4 mgrs; inst_delta_z byte-identical 04-25/27/28; SIGNAL_ALERT correctly persistent until ~05-15; treat top-30 changes (RVMD-in/ERAS-out) as cohort artifact; ATTRIBUTION lane only
- [13F cohort-quarantine prep (2026-05-01)](13f_cohort_quarantine_prep_2026_05_01.md) — Q1 2026 refresh ~2026-05-15. Pre/post diff harness `tools/check_13f_cohort_quarantine.py` (skeleton, untracked). G1/G2/G3 guardrails enforce snapshot completeness + producer freshness BEFORE quantitative interpretation. Quarantine trigger: Top-30 Jaccard < 0.70.
- [13F Q1 2026 preflight (2026-05-14)](13f_q1_2026_preflight_2026_05_14.md) — distortion audit complete (mean |inst_delta_z|=0.743 locked since 04-25); post-refresh validation gates defined (6 gates); awaits ~2026-05-15 file ingest; commit `70414e5c`
- **[13F Q1 2026 cohort CLEARED (2026-05-24)](13f_q1_2026_monitoring_live_2026_05_15.md)** `[resolved]` — Jaccard 0.875 ≥ 0.70; quarantine lifted; ~35 trading days accumulated; Phase 2 Step 5 KG unblocked on 13F gate (still blocked on h20d DEFERRED)
- **[13F refresh runbook COMPLETE (2026-05-17)](13f_refresh_runbook_complete_2026_05_17.md)** — 6 validation gates, decision matrix, clearance thresholds, hard NO-GO conditions, command quick reference; triggers ~2026-05-23 when ≥34 managers filed; location: `docs/13f_q1_2026_refresh_runbook.md`
- [Inst_delta forward shadow T0=2026-04-28](inst_delta_forward_shadow_T0_2026_04_28.md) — daily 19:30 ET; verdict h20d=2026-05-26; final 2026-07-21
- [Cross-signal forward shadow T0=2026-04-28](cross_signal_forward_shadow_T0_2026_04_28.md) — daily 19:40 ET; HL=17 focal; path (c) — no historical regen; descriptive 5/10d note ≠ alpha evidence
- [Interp framework (locked 2026-04-28)](interp_framework_forward_shadows_2026_04_28.md) — HL Jaccard >0.70 coherent / <0.40 weak; rolling 3d/5d medians; persistence > returns; no tuning before h20d AND post-13F refresh

## Alpha Extraction Roadmap + EES v3 (2026-04-14) — see `project_alpha_extraction_roadmap_2026_04_14.md`
- **EES v3 → structurally invalid (pmv-derived), CLOSED [resolved 2026-04-30]** — see [structural failure memo](ees_v3_structural_failure_2026_04_30.md). `conditional_misprice_score` is monotonic transform of pmv (Spearman -0.978); bin-residual IC ≈ 0; v2 anti-predictive after pmv control (t=-1.69). Sidecar kept as diagnostic only.
- Old IC claim `conditional_misprice_score IC +0.089 t=2.07` INVALIDATED (was pre-PIT-v2). Forward evidence: zero IC after pmv control. `base_rate_gap_score` remains anti-predictive — never promote.
- Rule: **cannot extract expectation error from expectation alone**. Future revisits require external (non-pmv) inputs: IV-vs-realized history, cross-sectional dispersion, microstructure flow.
- [Preliminary first read (superseded same-day)](ees_v3_incremental_ic_first_read_2026_04_30.md) — kept as audit trail; verdict review 2026-05-22 CANCELLED.

## Spec 062 Options Expression Layer (2026-04-13) [shipped, observation 30d]
- Phase 1+2+2.5 complete, merged main. Shadow-only, zero alpha impact. 156 tests. First review 30d post-emission
- [Options audit (2026-05-05)](biotech_options_audit_2026_05_05.md) `[shipped]` — 3-phase audit (data quality / liquid-universe / Spec 062 math); 4 code bugs patched at `33923f71` (DIRECTIONAL subtype, VARIANCE boundary, timing_confidence sum-check, surface_quality docstring); 5 unpatched items flagged (MIN_OI gate, max-staleness check, silent-fallback alert, schema validators, vendor-rating dependence)

## Spec 064 EES v3 Promotion Battery (2026-04-23) [resolved 2026-04-30 — formulation closed]
- [Spec 064](spec_064_ees_v3_promotion_battery_2026_04_23.md) — promotion path unreachable for this formulation (see structural failure memo). P0 sidecar continues as diagnostic; P1/P2 not run.

## Spec 072 Screener vNext (2026-05-01) [spec only — diagnostic-only redesign]
- [Spec 072](spec_072_screener_vnext_2026_05_01.md) — coinvest as binary GATE (not ranker), trap layer (catalyst/runway/liquidity/dilution/stale-thesis), catalyst+clinical quality ranks survivors. Operationalizes Spec 057 conditional clinical IC +0.103 (t=3.53). Zero code changes. D1–D9 diagnostic plan with **non-negotiable orthogonality constraint (D7/D8/D9 vs coinvest)** to prevent EES-style silent leakage. Hard prereq: Spec 071 Lane 1 + cohort-window close (~2026-05-15).
- [vNext D8/D9 — first orthogonal candidate signal (2026-05-01)](screener_vnext_d8_d9_first_candidate_2026_05_01.md) — clinical-quality conditional IC ≈ +0.20 within L3 (D9 raw t≈+5; effective ~+3 NW-corrected). PRELIMINARY, NOT promotion-grade. Verdict review 2026-05-22 (post-cohort-window + ≥30 resolved + dedup). **DO NOT build composite ranker** — that's how EES happened.

## Spec 063 Intraday Mover Watch (2026-04-17) [shipped, live]
- [Spec 063](spec_063_intraday_mover_watch.md) — Phases 1-3 complete; crontab live 2026-04-17. Alpaca Basic primary. Cadence: 2 open + 12 core-30min + 1 digest. 125/125 tests
- [News-enrichment phantom (2026-04-20)](spec_063_news_enrichment_phantom_2026_04_20.md) — `news_status="NONE"` is as-designed; no producer writes herald artifacts

## EES v2 (2026-04-12) [shipped] — see `ees_v2_production_2026_04_11.md`
- Trap T20 → B6 rank → conviction α=1.5 → guardrails. Checklist v2 5/5. Capacity $50M+. Daily monitoring automated

## Spec 068 Development Stage Audit (2026-04-27→04-28) [shipped]
- [Spec 068](spec_068_pre_implementation_2026_04_28.md) — display-only metadata audit; cohort key = stage_bucket. SHIPPED 2026-04-28 (commits ad8831da + b72afc6c). 4 overrides (MESO/VCEL/HALO/MLYS). 85 tests

## Spec 069 Module 2 v2 schema restore (2026-04-28) [spec only — NOT IMPLEMENTED]
- [Spec 069](spec_069_module_2_v2_schema_restore_2026_04_28.md) — root cause of dead `commercial_biotech` promotion; v2 dropped `has_revenue`/`revenue_scale_bucket`. Blast: 67 tickers (4 in top-30: IMCR/INSM/MIRM/STOK). Alpha-affecting → Checklist v2 required. commit `bbf2ab8e`

## SEC 6-K Coverage (2026-04-28) [resolved, audit passed]
- [Diagnosis Phase 0+1](sec_8k_coverage_diagnosis_2026_04_28.md) — 82-vs-387 = file/event unit confusion; CIK 341/342 after backfill
- [Shipped + audit PASS 5/5](sec_6k_coverage_shipped_2026_04_28.md) — audit ran 2026-05-01 (manual, 2d late): 463 events (+29.7%), 53 6-K records, 16/21 candidates, 97.5% 8-K retention

## Spec 057 Clinical Quality Score (2026-04-13) [monitor-only, REJECTED for sizing] — see `clinical_quality_score_2026_04_13.md`
- Conditional IC within top coinvest +0.103 (t=3.53). Sizing tilt tested + REJECTED (B6^1.5 alone wins). Use for attribution / cohort analysis only. Not for rank/sizing/selection

## Key Signal Evidence — see `signal_research_history.md`
- coinvest_score_z: selector Δ=+1.75pp (t=3.05), ranker IC=0.106, size-resid retains 79%
- inst_delta_z: IC=+0.077, selector Δ=+0.80pp — best complementary
- B6 (coinvest 65% + inst_delta 35%): Δ=+1.85pp t=3.56 IR=0.43
- clinical_score_v2_z REJECTED Δ=-0.68pp; all clinical lanes CLOSED
- All pre-PIT-correction backtest claims INVALIDATED (see Historical Backtest)

## Historical Backtest INVALIDATED (2026-04-17 audit)
- Prior PIT v2 snapshots (ruleset `69a0c7f8`) contaminated; 3-8/30 top-30 overlap with current. Old -25.1pp meaningless. Pseudo-PIT caveat applies even after regen. **Forward monitoring = only valid evidence**

## Standing Allocation Policy (2026-04-17) — see `policy_allocation_2026_04_17.md`
- Research/shadow 100% DEM; initial prod 30/70 DEM/XBI; scaled 60/40. XBI core (not EW-All). Always report 3 series; default headline = 30/70. Promotion 30→60 requires live evidence

## Clinical Stack v2 (2026-04-16) [shadow validation through 2026-04-30]
- Phase 2 prior 0.310→0.420 (HINT, Brier 0.336→0.250). Phase-conditional protocol w=0.08; biomarker [-0.05, 0.30]; endpoint v2 7-bucket w=0.08. Logit transmission 0.06/0.08/0.04
- Status: validated filter, not proven alpha. PIT-honest backtest Brier 0.041→0.039, returns +5.37% (identical), 6 dropped. Promotion: dropped names must resolve worse + retained returns must improve
- [Phase A verdict frozen 2026-05-04](clinical_phase_a_verdict_2026_05_04.md) — Selector NO_GO; Ranker SHADOW only on `clinical_design_quality`; EV non-evaluable until outcome-binder wired. Verdict review 2026-05-22.

## Catalyst Phase A verdict (2026-05-04) + EV binder update (2026-05-06)
- [Phase A verdict + binder update](catalyst_phase_a_verdict_2026_05_04.md) — Selector ACTIVE/NO_MORE_WEIGHT; Ranker SHADOW on `catalyst_score`; EV blocked: spec_073 CLOSED (pcs bound 113/120) but `prediction_composite_score` is WRONG field (screener quality, not P(HIT)); correct field = `event_ev_p_hit` from EV artifacts — spec_077 scoped; backfill unsafe (30% join rate); n(HIT/MISS post-PIT)=7 → calibration ~2026-07-01
- [Spec 077 — event_ev_p_hit binder](../biotech-screener/specs/changes/spec_077_event_p_hit_binder_2026_05_06.md) `[EXTERNAL]` — forward-only; node_id exact / (ticker,date±7d) fallback; touches CRT + postmortem writer only. Path resolves from project repo root, not from memory dir; not a broken link.

## Polymarket alpha verdict (2026-05-05)
- [Phase 0 + alpha event study frozen 2026-05-05](polymarket_alpha_verdict_2026_05_05.md) — ANECDOTAL_SHADOW / NO VERDICT. Public CLOB price-history archive-truncated for 2025 markets (zero retrievable points); only 5 of 25 closed FDA-approves events have history, 1 small/mid biotech (AXSM HIT +12%). Collector `tools/poll_polymarket_biotech.py` retained for prospective shadow only; no cron, no production wiring. Re-test thresholds: <25 anecdotal, 25-50 shadow, >50 Checklist v2 eligible. ARGX Vyvgart (ends 2026-05-10) is next prospective gold-case.

## Insider Form 4 wiring (2026-04-24) [observation period ended 2026-05-01 — flip eval outcome not recorded]
- [Pass B landed](project_insider_form4_pass_b_landed_2026_04_24.md) — `insider_net_buy_value_90d` diagnostic pass-through. Scoring closed. Flip-to-required eligible 2026-05-01 after 5 stable snapshots
- Spec 065 — 8 hard criteria + 2026-05-01 eval checklist. Flip = data-integrity gate ONLY; does NOT promote to selector/ranker/sizing

## Cron watchdog phase-2 recovery (2026-04-24) [shipped]
- [Watchdog recovery](project_watchdog_recovery_restored_2026_04_24.md) — 3 dead-recovery bugs fixed; verified 2026-04-25
- [Post-snapshot supervisor + watchdog gate (2026-04-28)](project_post_snapshot_supervisor_2026_04_28.md) — gates on `data/snapshots/$TODAY/rankings.csv`; Phase 1 covers AACT + Herald; review 2026-05-05 [past — Phase 2 decision outcome not recorded in memory]

## run_screen production audit (2026-04-25) [shipped, open controls]
- [Audit](audit_run_screen_2026_04_25.md) — production safe with material PIT/data warnings. PIT-strict + ranker-required + deterministic-timestamps landed. Open: market_data.json no date field; priced_move_pct unit drift 13/250

## Rank-change monitor + verification gate (2026-04-27→04-28)
- [Read-only monitor](rank_change_monitor_2026_04_27.md) [shipped] — wired into `cron_daily_production.sh`; calibration audit 2026-05-11; hysteresis spec-only
- [Tier 1 snapshot integrity verifier (commit 1f6bd518)](plan_snapshot_integrity_verifier_tier1.md) [shipped] — `tools/verify_snapshot_integrity.py`; rankings hash + 17/18 deps verified. Tier 2 (spec_067), Tier 3 deferred
- [Pause LIFTED 2026-04-28](policy_pause_until_2026_04_28_verification.md) [resolved] — verification passed; supervisor + Tier 1 verifier shipped; Massive paused; yfinance throttled

## Active Monitoring Windows
- **Clinical TX shadow review 2026-04-30** [past — outcome not recorded; verify whether review was completed]
- AXSM PDUFA 2026-04-30 [past — event occurred; no resolution record found in memory]; ARVN 2026-06-05 (corrected via BPIQ + IR 2026-04-26); RGNX 2026-05-12; BIIB 2026-05-24 (RR decider, 1/3 scorable)
- Coinvest shadow ends ~2026-05-03 [past — `shadow_review_gate.py` should have run 2026-05-03; verify log output]
- 13F next refresh ~2026-05-15 (Q1 2026); Expression overlay first review 30d post-emission
- Hardening diagnostics audit 2026-05-04 17:00 ET — `cron_one_shot_2026_05_04.sh` [past — verify log]
- Post-snapshot supervisor review 2026-05-05 17:00 ET — `cron_one_shot_2026_05_05.sh` (decides Phase 2) [past — verify Phase 2 decision recorded]
- Rank-change calibration audit 2026-05-11 17:00 ET — `cron_one_shot_2026_05_11.sh`
- Event-analyst builder verification 2026-05-12 09:00 ET — `cron_one_shot_2026_05_12.sh` (validates the `10 19 * * 1-5` cron added 2026-05-01 has been firing daily; expects 6 weekday artifacts 05-04→05-11)
- Postmortem pipeline verification 2026-05-08 19:30 ET — `cron_one_shot_2026_05_08.sh` (confirms calibration_evidence ran with >19 postmortems after the 2026-05-02 detection fix; STATUS=OK / STILL_NO_DATA / NOT_FIRED)
- inst_delta forward shadow verdict h20d=2026-05-26 (final 2026-07-21); cross-signal forward shadow verdict h20d=2026-05-26
- Options coverage (2026-05-05): 29% liquid (87/299) — drifted from 35% (105/297) at Spec 062 ship; 04-13→04-25 churn Jaccard 0.57; see `biotech_options_audit_2026_05_05.md`

## Model Directions (2026-04-14) — see `project_model_directions_2026_04_14.md`
- Truth framework: works? → approved? → paid? → survives? → mispriced?
- Priority adds: S-curve stage, runway-to-catalyst, conditioned PoS, M&A optionality, macro regime
- Risk mgmt ≠ alpha. Listed vehicles = expectation inference, not copy-trading

## Closed Lanes — see topic files
- Clinical as selector/ranker; options as alpha (Spec 053); static execution (Spec 054); execution-delta (IC=-0.13); Form 4 insider; total_volume_z; fixed sleeves; dynamic caps; always-on rank-weighting; quality tiebreaks
- All pre-PIT-correction benchmark claims DEPRECATED
- [Family B scrapped 2026-04-19](family_b_scrapped_2026_04_19.md) [resolved] — institutional filter-gate path removed; do not revive without explicit direction
- [EES v3 / expectation-error formulation (2026-04-30)](ees_v3_structural_failure_2026_04_30.md) [resolved] — structural pmv-dominance; cannot extract expectation error from expectation alone; do not revive current formulation

## Infrastructure
- PIT financials: 339 tickers (`production_data/pit_financials/`). CRT: 101 res (52 HIT/17 MISS/12 NEEDS_REVIEW/17 DELAYED). Auto-classifier + Herald
- Event EV: 6-layer Bayesian (`event_ev/`); clinical-to-p_hit (flag). Evidence: PIT-anchored per (node_id, as_of_date) + PubMed
- PubMed: NCBI E-utilities, NCBI_API_KEY in .env, 24h cache. Drug map: 300 tickers
- Options overlay (Spec 059); Timing hazard v4 Brier 0.131 (dashboard-only); Checklist v2 (`common/stats/`, 6 modules, 36 tests)
- HINT research: `research/`, vendor/hint/ gitignored, 17,614-trial benchmark

## OpenClaw Fleet — see `openclaw_fleet.md`
- 29 agents in `agents/`. Run via `tools/run_agent_direct.py` after `source .env` — NOT `openclaw agent` (gateway billing broken). Real schedule: `crontab -l`

## Feedback
- [Audit-to-tickets prompt](feedback_audit_to_tickets_prompt.md) — canonical prompt for converting audit memo → 4 scoped tickets; Ticket 1 only implementation candidate; others stay doc/checkpoint/audit
- [Net-of-cost reporting](feedback_net_of_cost_reporting.md) — performance net of costs first; gross secondary
- [Model doc location](feedback_model_doc_location.md) — `docs/MODEL_DOCUMENTATION.md`, not root
- [DEM is book of record](feedback_dem_book_of_record.md) — never composite
- [No formatter churn](feedback_no_formatter_churn_in_model_work.md)
- [Autonomy claims need evidence](feedback_autonomy_claims.md)
- [Agent governance](feedback_agent_governance.md) — read-only judges / artifact writers / human-only actions
- [Anchor-dominated framing](feedback_anchor_dominated_framing.md)
- [Runway severity architecture](feedback_runway_severity_architecture.md) — cross-layer control variable; diagnostic-first
- [Coinvest is filter not alpha](feedback_coinvest_not_alpha.md) — quality filter only
- [Manager acceptance test](feedback_manager_acceptance_test.md) — `tools/onboard_manager.py`; never hand-edit
- [Cohort-change quarantine](feedback_cohort_change_quarantine.md) — first snapshot post-13F-add has contaminated `inst_delta_z`/`rank_delta`
- [OpenClaw run entry point](feedback_openclaw_run_entry_point.md) — `tools/run_agent_direct.py` + `.env`
- [Heartbeat env phantom](openclaw_heartbeat_env_phantom_2026_04_27.md) — bash `[ -n "$SECRET" ]` falsely fails; treat phantom unless corroborated
- [Observation bias in cron monitoring](feedback_observation_bias_cron_monitoring.md) — missing polls bias toward "structurally late"
- [calibration_evidence threshold false positive (2026-05-02)](calibration_evidence_threshold_false_positive_2026_05_02.md) — STALE alert fires on time, but NO_DATA early-exit is correct when no new postmortems; check `artifacts/postmortem/` first
- [Incomplete-run silent fallback (2026-04-07/08/11/12)](incomplete_production_run_fallback_2026_05_01.md) — missing `institutional_summary_delta.json` → `inst_delta_z=0` → ranker falls back to coinvest+financial → fake "regime" signal. Check snapshot completeness FIRST before interpreting ρ(coinvest, final)≥0.95.
- [Pause between control-plane changes](feedback_pause_between_control_plane_changes.md) — wait one prod cycle; don't stack
- [Quarantine fixes need blast-radius diff](feedback_quarantine_blast_radius_diff.md) — before/after per-ticker; unbounded blast = re-scope
- [No recursive supervision](feedback_no_recursive_supervision.md) — agents → monitor → supervisor → sentinel (terminus); fail-closed
- [Verify sentinel verdict directly](feedback_verify_sentinel_verdict_directly.md) — downstream monitors can invert trend direction; read `agents/sentinel/memory/*.md` before acting on "ROLLBACK_RECOMMENDED"
- [Held-file precedence](feedback_held_file_precedence.md) — held-from-commit instructions are sticky; "commit and push" does NOT auto-include previously-held files (2026-05-07 watchlist revert)

## External Data
- DealForma DROPPED. Purple Book (biologics). AACT (clinical mirror)
- [Massive license — pause Task #1 EXECUTED 2026-04-28](massive_license_downgrade_2026_04_27.md) — Mon-Sat 07:00 cron commented; latest day-agg 2026-04-24. Task #2 (minute_aggs/trades audit before tier downgrade) PENDING

## Dev Environment
- [WSL2 aarch64](env_wsl2_aarch64.md) — Windows on ARM; check aarch64 wheel before `pip install`
- [WSL uptime required during cron windows](env_wsl_uptime_required.md) — min 16:00-20:30 ET Mon-Fri; Friday calibration_evidence 19:00 ET; ask "was WSL running?" before debugging missed cron
- [Qlib pilot DROPPED 2026-04-18](qlib_pilot_verdict_2026_04_18.md) [resolved] — no aarch64 wheel
- [FinGPT pilot DROPPED 2026-04-18](fingpt_pilot_verdict_2026_04_18.md) [resolved] — killed before endpoint spend
- [Classifier hardening complete 2026-04-19](classifier_hardening_2026_04_19.md) [resolved, post-cutover validation queued] — escalation pool 2,612 → 1,292; spot-check 9/10
- [Expectation-model wiring DEBUNKED 2026-04-19](expectation_model_wiring_not_needed_2026_04_19.md) [resolved] — only doc-comment change

## Memory Cleanup
- [Batch 1 (2026-05-06)](memory_cleanup_batch1_2026_05_06.md) `[resolved]` — 8 MEMORY.md status edits, 15 March session logs moved to archive/session_logs/, 0 deletions; link check 70 OK / 1 EXTERNAL / 0 MISSING
- Batch 2A (orphaned worktrees + safe cache) — deferred; disk hygiene, not model hygiene

## Session Logs
- [2026-04-01 through 2026-04-04](session_2026_04_04.md) — see topic files (March logs archived to archive/session_logs/)
