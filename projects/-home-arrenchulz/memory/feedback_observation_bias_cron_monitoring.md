---
name: Observation bias in cron-gated monitoring — missing windows bias toward specific wrong conclusions
description: When a threshold-triggered monitor misses the opening polls of a session, the resulting dataset isn't just sparser — it is biased in a direction that makes the system look structurally late. Do not infer structural properties from a sample where the counter-evidence window is the missing window.
type: feedback
originSessionId: 92861731-bf1b-4e00-a354-806d66aabb2e
---
When a cron-gated monitoring system (e.g. intraday mover watch, daily QA
check, price-action alerter) fails to run during part of a session, the
resulting dataset is **not merely incomplete** — it is **biased** in a
specific direction.

**Why:** For threshold-triggered detectors, the "build phase" of a signal
(sub-threshold → threshold crossing) is only visible in early polls. If
early polls are missing, the detector first sees each mover *after* it has
already crossed its threshold — making the system look like it detects
moves late on their trajectory. The evidence of early detection was
literally erased by the observation gap.

Worked example: 2026-04-20 intraday mover watch.

- Host-sleep killed the 09:35, 09:50, 10:00 polls.
- First observed poll was 10:30 ET (60 min after open).
- Observation: 8 of 9 HIGH-severity tickers hit their peak abs-move on
  first appearance ("peak ≈ first appearance" pattern).
- **Naive conclusion** (wrong): "System is structurally late — cadence
  and threshold design prevent early detection."
- **Correct conclusion:** Cannot distinguish structural latency from
  observation bias, because the exact window where MED→HIGH builder
  trajectories would have been visible is the window we didn't poll.
  GHRS is direct proof the bias is real: it opened at +14.45% and peaked
  at +26.57%, so it *did* build — we just didn't see the build phase.

## How to apply

- When evaluating a monitoring system after a partial-coverage day, list
  what each observed pattern could mean under (A) structural design and
  (B) missing-window observation bias, and check whether the missing
  window would have contained the A-vs-B distinguishing evidence.
- If it would have, do not make a structural claim from that day's data.
  Wait for an uncontaminated session.
- This is the monitoring-system analog of the survivorship bias / missing-
  data pattern: absence of a data point is not neutral — it systematically
  removes one class of evidence.
- Applies to any threshold-triggered alerter, polling-based monitor, or
  event-count system where early-vs-late trajectory matters. Not just
  Spec 063.
- Related governance rule: `feedback_autonomy_claims.md` — don't ship
  conclusions whose premise you can't verify. This memory extends that to
  "don't ship *structural* conclusions from a dataset whose gap is
  exactly the structural-test evidence."
