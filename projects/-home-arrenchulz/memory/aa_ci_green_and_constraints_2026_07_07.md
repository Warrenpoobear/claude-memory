---
name: aa-ci-green-and-push-constraints-2026-07-07
description: AA repo CI greened (PR
metadata: 
  node_type: memory
  type: reference
  status: active
  created: 2026-07-07
  originSessionId: 7e4e3e0f-c930-464d-924a-c7a0a4688fbb
---

**AA repo (`WR-SW-Dev/WR-asset-allocation`) CI was chronically red on `main`; greened via PR #7 (`f2f2d31`, merged 2026-07-07).** The `core` lint gate (`ruff format --check`) had been failing so long that PRs were merged over it, masking deeper breaks. Fixing lint peeled back THREE dormant failures in sequence:
1. `ruff format` on 9 Monte Carlo/CMA files (unformatted at merge).
2. `core` Test: **`openpyxl` was never in requirements** despite `pandas.read_excel` needing it for workbook/position ingestion (Phase 14/15) → added `openpyxl==3.1.5` to `requirements.txt`. Also a latent prod gap.
3. `adapters` e2e: CI runs a global `sed 's|  engine: stub|  engine: riskfolio|'` over `base.yaml`, which flipped BOTH allocation AND implementation engine lines → `implementation.engine=riskfolio` rejected by `ImplementationRefConfig`. Fixed in **config** (removed redundant explicit `implementation.engine` from `base.yaml`; it defaults to stub) so only the allocation line matches — chosen over editing `ci.yml` because of the push constraint below.

**Push constraints (both bite in this repo):**
- Local hook `~/.claude/hooks/block-dangerous-git.sh` blocks `git push` (and `git reset --hard`) entirely → I CANNOT push; the **user must run `git push`** (via `! ...`). Use `git reset --soft` (allowed) not `--hard`.
- GitHub rejects pushes that modify `.github/workflows/*.yml` because the user's OAuth token **lacks the `workflow` scope**. So CI-workflow fixes must be done via config, OR the user runs `gh auth refresh -s workflow`.
- `gh pr merge` works (API, not `git push`) — merging is fine for me.

**Concurrent-session hazard (confirmed active):** a parallel Claude session runs in a **git worktree at `/mnt/c/Projects/asset allocation/aa-fmt`** with `main` checked out (so `gh pr merge --delete-branch` can't switch local main — cosmetic error, merge still succeeds). That session shipped PR #8 (Morningstar ingestion, unformatted) + PR #9 (formatting it) mid-session, re-reddening `main` under me — had to merge main + reformat in PR #7. See [[feedback_asset_allocation_shared_checkout_2026_07_06]], [[feedback_shared_checkout_concurrency_2026_06_30]].

**Pre-push lint gate SHIPPED — PR #10 MERGED (`1aa3b75`, 2026-07-08).** Committed native git hook `hooks/pre-push` mirrors CI core lint (`ruff check` + `ruff format --check` on src/tests/scripts), blocks the push if dirty (with a `ruff format` hint), degrades to a warning if ruff absent (CI backstop). Uses repo-pinned ruff, no new dep, no `.github/` change (so pushable without workflow scope). **Enable once per clone: `git config core.hooksPath hooks`** (documented in CLAUDE.md); linked worktrees inherit via shared config. Complements the Claude-Code `block-dangerous-git.sh` (different layer: that gates agent tool calls, this gates real `git push` incl. the user's `! git push`). Dogfooded — fired live on its own push.
