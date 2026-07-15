#!/bin/bash
# Blocks dangerous git commands at PreToolUse. Uses python3 (jq not available on this host).

INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)

# Path prefixes where a PLAIN `git push` is allowed (destructive ops stay blocked
# everywhere). Command must reference the path (e.g. `git -C "<path>" push`).
PUSH_ALLOWED_PREFIXES=(
  "/mnt/c/Projects/asset allocation/"
  "/mnt/c/Projects/biotech_screener/biotech-screener"
  "/mnt/c/Projects/research"
  "/home/arrenchulz/.claude"
  "~/.claude"
)

DANGEROUS_PATTERNS=(
  "git reset --hard"
  "git clean -fd"
  "git clean -f"
  "git branch -D"
  "git checkout \."
  "git restore \."
  "push --force"
  "push -f"
  "reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qE "$pattern"; then
    echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
    exit 2
  fi
done

# Non-force `git push` blocked UNLESS the command targets an allowed prefix.
if echo "$COMMAND" | grep -qE '\bgit\b[^&|;]*\bpush\b'; then
  push_allowed=0
  for prefix in "${PUSH_ALLOWED_PREFIXES[@]}"; do
    if [[ "$COMMAND" == *"$prefix"* ]]; then
      push_allowed=1
      break
    fi
  done
  if [[ "$push_allowed" -eq 0 ]]; then
    echo "BLOCKED: '$COMMAND' is a git push outside an allowed repo. The user has prevented you from doing this." >&2
    exit 2
  fi
fi

exit 0
