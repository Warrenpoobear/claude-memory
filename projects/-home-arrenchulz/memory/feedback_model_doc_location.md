---
name: Model doc canonical location
description: Always update docs/MODEL_DOCUMENTATION.md, not the root copy
type: feedback
originSessionId: 5ba4ffdd-7e02-4b9f-ad61-fe538d3076f8
---
Model documentation lives at `docs/MODEL_DOCUMENTATION.md` — that is the canonical location.
Do NOT edit the root `model_documentation.md` as the primary target.

**Why:** The root copy exists but `docs/` is where the user expects it. Editing the root
creates drift between the two files.

**How to apply:** When updating model documentation, edit `docs/MODEL_DOCUMENTATION.md` directly.
If the root copy also needs syncing, copy from docs/ to root, not the other way around.
