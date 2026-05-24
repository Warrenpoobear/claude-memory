---
name: Frame model as anchor-dominated, not single-factor
description: Say "anchor dominates book membership" not "single-factor model" — secondary signals still contribute to within-book ordering
type: feedback
---

When describing the model's structure, say "anchor-dominated" not "single-factor."

**Why:** The optionality anchor determines who's in the top-20, but the engine still has structured secondary contributions (inst_delta, cal_alpha, clinical_quality) that affect ordering within the book. Calling it "single-factor" implies the secondaries are useless everywhere, which overstates the finding. The real gap is within-bucket differentiation, not the anchor itself.

**How to apply:** When reporting sort signal audits or threshold sweeps, distinguish between book membership (anchor-dominated) and within-book ordering (where secondary signals and within-bucket reranking matter). The next alpha improvement is better catalyst-name differentiation inside buckets, not another global IC sweep.
