---
name: Model doc canonical location
description: AA-repo model documentation lives at docs/MODEL_DOCUMENTATION.md (single copy; moved 2026-07-14)
type: feedback
originSessionId: 5ba4ffdd-7e02-4b9f-ad61-fe538d3076f8
---
AA repo (`WR-asset-allocation`): model documentation lives at `docs/MODEL_DOCUMENTATION.md` —
moved there from repo root at the user's instruction on 2026-07-14 (commit `c8e1e55`), alongside
the designed PDF export (`docs/WR Asset Allocation Model Documentation.pdf`; first tracked `3afd16b`,
regenerated fresh `19b4def` 2026-07-14 — 15pp, adds hardening section, 550-test stats, golden-data PE
figure). PDF regen is one command: `node data/external/model_doc_export/render_pdf.mjs` (print-HTML
source + Playwright-Chromium renderer persisted gitignored there; update the HTML from the md first).
There is exactly ONE copy; the earlier version of this note describing a root/docs split was
inaccurate — before 2026-07-14 only the root copy ever existed (verified via git history).

**Why:** The user expects documentation under `docs/`; a single canonical copy avoids drift.

**How to apply:** Edit `docs/MODEL_DOCUMENTATION.md` directly. Doc-as-spec rule (CLAUDE.md):
every behavior change updates it in the same commit series. Bare-filename mentions in code
comments/docstrings are fine as-is; path-sensitive references (README link, CLAUDE.md guidance,
PROJECT_SCOPE file table) were updated in `c8e1e55`. The 2026-05-05 external-review-triage
governance flag (68 days stale) was resolved by the doc entry in `fc04aeb`.
