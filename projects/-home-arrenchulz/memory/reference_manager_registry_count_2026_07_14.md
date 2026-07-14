---
name: reference-manager-registry-count-2026-07-14
description: Authoritative 13F manager registry count — v3.2 = 49 elite_core + 6 conditional = 55 total; BMIQ routine misreports it
metadata: 
  node_type: memory
  type: reference
  originSessionId: d87b938c-7607-4468-9db7-87fe1ad2db5b
---

`production_data/manager_registry.json` metadata `version=3.2`, `last_updated=2026-05-22`: **49 elite_core + 6 conditional = 55 total** (verified by direct JSON count 2026-07-14). Consistent with the h20d re-eval "55-mgr Jaccard 0.463" cohort in [[project-forward-validation-hardening-2026-07-10]].

Two wrong figures in circulation:
- **BMIQ weekly routine** (Biotech Manager Intelligence Weekly, Jul 10 issue) reports "57 managers (51 elite_core + 6 conditional)" while citing the same v3.2/2026-05-22 file — the routine is **misreading the registry**; its prompt/parser needs fixing (Hermes-side routine, not repo code).
- **Older "corrected July 4" figure of 51 total (45+6)** is stale vs the actual file.

When any doc, skill, or routine cites a manager count, verify against the JSON directly: `python3 -c "import json; r=json.load(open('production_data/manager_registry.json')); print(len(r['elite_core']), len(r['conditional']))"`.
