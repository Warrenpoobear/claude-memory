---
name: Signal demotion path (clarifies freeze policy)
description: Demotions/removals under confirmed degradation are not Checklist v2 promotions; they follow a 5-element governed demotion path (two-frame evidence + comparator probe + Spec-style writeup + operator sign-off + receipt/changelog).
type: feedback
status: active
related: policy_alpha_freeze_2026_04_04
originSessionId: e5879815-4335-4bbf-9ad9-eb9f5fc2dbd1
---
## Policy clarification (2026-05-06)

The freeze policy (`policy_alpha_freeze_2026_04_04.md`) states "No new promotions w/o Checklist v2." That wording targets PROMOTIONS — adding new alpha. It does not address SIGNAL DEMOTIONS / REMOVALS, and Checklist v2 (which tests positive predictive evidence) is structurally inapplicable to a signal that has been confirmed anti-predictive.

Per Spec 086 audit verdict (`artifacts/audit/spec_086_v1_14_0_freeze_compliance_audit_2026_05_06.md`):

> A signal demotion/removal under confirmed degradation is not a "new promotion"
> for Checklist v2 purposes.
>
> It still requires a governed demotion path:
> 1. two-frame degradation evidence,
> 2. comparator / lane-integrity probe,
> 3. Spec-style writeup,
> 4. operator sign-off,
> 5. receipt/changelog artifact.

**Why:** Signal demotion is sometimes urgent (anti-predictive signal continues to harm production until removed). Requiring Checklist v2 (which tests positive evidence) for removals would either block timely defensive action OR force operators to bypass the gate (which is what happened with v1.14.0). Codifying the demotion path as a separate, evidence-bound process resolves the ambiguity without lowering the governance bar.

**How to apply:**

When a signal shows degradation:

1. **Two-frame degradation evidence required.** Two independent methodologies, both negative. Standard pair: `ic_health_monitor` rolling-IC ALERT + `calibration_evidence` event-IC postmortem. Both must be negative on the same signal in the same window.
2. **Comparator / lane-integrity probe required.** Verify the degradation is signal-specific, not a broken data feed or regime shift affecting the whole lane. Standard probe: rolling IC of comparator signal in the same lane over the same window. If comparator is also broken, escalate to lane-level investigation, not single-signal demotion.
3. **Spec-style writeup required.** Formal document with: facts (cited artifacts), inference (separated from facts), options (A/B/C/D with trade-offs), what-this-memo-does-not-answer, provenance. Pattern: `INST_DELTA_Z_SIGNAL_HEALTH_GOVERNANCE_REVIEW_2026_05_04.md`.
4. **Operator sign-off required.** Named operator + date filed. Pattern: `INST_DELTA_Z_GOVERNANCE_LOG_2026_05_04.md`.
5. **Receipt + changelog required.** A receipt JSON in `artifacts/promotions/` AND a changelog entry in `RULESET_CHANGELOG.md`. Receipt should be written by `scripts/promote_ruleset.py` to ensure consistency with all other tooling that consumes receipts (`tools/ruleset_health_monitor.py`, `tools/build_ops_digest.py`, `tools/weekly_health_packet.py`). Bypassing the script is a process violation regardless of the demotion-vs-promotion classification.

**Conditions for re-opening** (per the demoted signal's governance log):
- Demoted signals are not removed permanently. The governance log MUST specify quantitative conditions under which the signal would be re-evaluated (e.g., "re-open if mean_ic recovers above +0.02 sustained for 10+ dates AND event-IC turns positive — not before both").

**What this clarification does NOT change:**
- Promotions of NEW signals still require Checklist v2 (FM + bootstrap + FDR + LOSO + year stab) per `policy_alpha_freeze_2026_04_04.md`.
- The 6-gate Checklist v2 itself is unchanged.
- The promote-script invariants (receipt + changelog) apply equally to demotions and promotions.

**Precedent:**
- v1.14.0 / `8887576e` (2026-05-04): `inst_delta_z` selector weight 35%→0%. Two-frame ALERT + comparator probe + Spec-style writeup + operator sign-off all satisfied; promote-script bypassed (process violation; remediated by synthetic backfill 2026-05-06 — see `artifacts/promotions/promotion_2026-05-04_8887576e.{json,md}`).
