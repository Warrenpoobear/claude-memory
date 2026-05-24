---
name: Canonical audit-to-tickets prompt
description: Standard prompt pattern for converting an investment logic audit into four scoped implementation tickets; prevents Claude from drifting into implementation or schema cuts
type: feedback
originSessionId: b513a5f3-70ed-4d33-9abf-8a4a0748b694
---
Use this prompt verbatim (or as a close template) when asking Claude to convert an audit memo into implementation tickets for the biotech screener. The key value is the explicit hold-off list and the instruction to make only Ticket 1 an implementation candidate.

**Why:** Earlier audits had Claude drift into implementation details, schema pruning, or weight recommendations before the binder was fixed. This prompt locks scope explicitly.

**How to apply:** Paste after sharing or referencing the audit memo. Adjust ticket goals/constraints per session, but preserve the structure: goals → constraints → deliverables → hold-off list → final deliverable format → thesis to preserve → primary blocker.

---

```
Good audit. Do not implement ranker changes, selector changes, EV scoring changes, or schema cuts yet.

Convert the audit into a prioritized implementation plan with four separate tickets.

Ticket 1 — Catalyst prediction binder
Priority: highest
Goal: populate decision-time catalyst prediction fields into later catalyst resolution records, especially `prediction_composite_score`, so Event EV / catalyst quality can be evaluated.
Constraints:
* no selector/ranker changes
* no EV scoring promotion
* no broad refactor
* no production alpha changes

Deliver:
* root cause
* files/functions likely touched
* minimal diff plan
* test command
* rollback path

Ticket 2 — Financial_score logic documentation
Goal: document the investment logic behind the negative `financial_score` ranker weight.
Constraints:
* do not retrain
* do not change weights

Deliver:
* causal hypothesis
* why this could make money inside the coinvest-selected universe
* what would falsify it
* where to document it

Ticket 3 — inst_delta_z restoration checkpoint
Goal: create a dated review checkpoint after 13F refresh / cohort quarantine.
Constraints:
* do not restore automatically
* do not change current weights now

Deliver:
* review date
* required evidence
* decision options: restore / keep zeroed / extend shadow
* test command or audit command

Ticket 4 — Schema prune audit
Goal: verify alleged dead fields before cutting anything.
Constraints:
* do not remove fields yet
* verify directly from latest `rankings.csv`
* verify producer code
* separate:
  * truly dead field
  * inactive by design
  * shadow field
  * backward-compatible legacy field

Important contradiction to resolve:
The investment logic audit says `clinical_design_quality` is zero-fill / never populated, but earlier Phase A clinical audit reported it as present/nonzero around 79.6%. Verify from latest snapshot and producer code before making any schema recommendation.

Hold off on:
* catalyst timing ranker feature
* catalyst_score ranker promotion
* clinical ranker tests
* schema removals
* any selector/ranker/Event EV weight changes

Final deliverable:
One ticket per item with:
* severity
* exact evidence
* likely files/functions
* minimal implementation path
* test command
* rollback path

Thesis to preserve:
Current system thesis is coinvest quality filter + financial stress/upside discriminator + catalyst timing as release valve.

Primary blocker:
The system cannot validate the most important event logic until the catalyst prediction/outcome binder is fixed.

I'd make Ticket 1 the only implementation candidate after Claude scopes the four. The other three should stay documentation/checkpoint/audit until the binder is fixed.
```
