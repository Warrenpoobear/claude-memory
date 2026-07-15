#!/usr/bin/env python3
"""Build memory_graph.json from all .md files in the memory directory.

Parses YAML frontmatter (name, description, metadata.type/status/expires/
resolves/supersedes/related) and scans bodies for [[slug]] links.

Output schema:
  {
    "schema": "1.1",
    "generated_at": "<ISO>",
    "memory_root": "<path>",
    "summary": {nodes, edges, by_type, by_status},
    "nodes": { "<slug>": { path, name, description, type, status,
                           created, resolved_at, resolution,
                           expires: {date, condition} } },
    "edges": [ {from, to, kind} ]
  }

Edge kinds:
  related      — [[name]] inline link
  resolves     — metadata.resolves
  supersedes   — metadata.supersedes
  explicit     — metadata.related list entries
"""

import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

MEMORY_ROOT = Path(__file__).resolve().parent.parent / "projects" / "-home-arrenchulz" / "memory"
OUTPUT = MEMORY_ROOT / "memory_graph.json"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
LINK_RE = re.compile(r"\[\[([^\]]+)\]\]")


def _strip(v):
    return v.strip() if isinstance(v, str) else v


def _yaml_val(text, key):
    """Extract a scalar value from minimal YAML (no full parser dependency).

    Whitespace around the colon is matched with `[ \t]*` (not `\\s*`) so an
    empty value (`key:`) does NOT bleed into the following line's content.
    """
    m = re.search(rf"^{re.escape(key)}[ \t]*:[ \t]*(.+)$", text, re.MULTILINE)
    if not m:
        return None
    v = m.group(1).strip().strip('"').strip("'")
    # Treat empty inline collections as absent, not as a literal "[]"/"{}" slug.
    if v in ("[]", "{}"):
        return None
    return v if v and v.lower() not in ("null", "~", "none", "") else None


def _yaml_nested(text, parent, child):
    """Extract metadata.child style nested scalar."""
    block_m = re.search(rf"^{re.escape(parent)}\s*:\s*\n((?:[ \t]+.+\n?)*)", text, re.MULTILINE)
    if not block_m:
        return None
    block = block_m.group(1)
    m = re.search(rf"^[ \t]+{re.escape(child)}[ \t]*:[ \t]*(.+)$", block, re.MULTILINE)
    if not m:
        return None
    v = m.group(1).strip().strip('"').strip("'")
    return v if v and v.lower() not in ("null", "~", "none", "") else None


def _yaml_list(text, key):
    """Extract a YAML list value (either inline [a,b] or block - item)."""
    m = re.search(rf"^{re.escape(key)}\s*:\s*(.+)$", text, re.MULTILINE)
    if m:
        raw = m.group(1).strip()
        if raw.startswith("["):
            items = [i.strip().strip('"').strip("'") for i in raw.strip("[]").split(",")]
            return [i for i in items if i]
    # block list
    block_m = re.search(rf"^{re.escape(key)}\s*:\s*\n((?:\s+-\s+.+\n?)*)", text, re.MULTILINE)
    if block_m:
        items = re.findall(r"^\s+-\s+(.+)$", block_m.group(1), re.MULTILINE)
        return [i.strip().strip('"').strip("'") for i in items if i.strip()]
    return []


def parse_file(path: Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    fm_match = FRONTMATTER_RE.match(text)
    fm = fm_match.group(1) if fm_match else ""
    body = text[fm_match.end():] if fm_match else text

    # Derive slug: prefer frontmatter name, fall back to stem
    name_raw = _yaml_val(fm, "name") or path.stem
    slug = name_raw.lower().replace(" ", "-")

    description = _yaml_val(fm, "description") or ""
    mem_type = _yaml_nested(fm, "metadata", "type") or _yaml_val(fm, "type") or "unknown"
    status = (
        _yaml_nested(fm, "metadata", "status")
        or _yaml_val(fm, "status")
        or "active"
    )
    created = _yaml_nested(fm, "metadata", "created") or _yaml_val(fm, "created")
    resolved_at = _yaml_nested(fm, "metadata", "resolved_at") or _yaml_val(fm, "resolved_at")
    resolution = _yaml_nested(fm, "metadata", "resolution") or _yaml_val(fm, "resolution")

    expires_date = _yaml_nested(fm, "expires", "date") or _yaml_nested(fm, "metadata", "expires")
    expires_cond = _yaml_nested(fm, "expires", "condition")

    resolves = _yaml_nested(fm, "metadata", "resolves") or _yaml_val(fm, "resolves")
    supersedes = _yaml_nested(fm, "metadata", "supersedes") or _yaml_val(fm, "supersedes")
    related = _yaml_list(fm, "related") or _yaml_list(fm, "metadata.related")

    # Inline [[links]] from body
    body_links = [m.strip() for m in LINK_RE.findall(body)]

    node = {
        "path": path.name,
        "name": name_raw,
        "description": description,
        "type": mem_type,
        "status": status,
        "created": created,
        "resolved_at": resolved_at,
        "resolution": resolution,
        "expires": {"date": expires_date, "condition": expires_cond},
    }
    # resolves / supersedes are scalar fields but are sometimes authored as a
    # comma-joined list of targets ("a, b"); split so each becomes its own edge.
    def _split(v):
        return [p.strip() for p in v.split(",") if p.strip()] if v else []

    edges_raw = (
        [(link, "related") for link in body_links]
        + [(r, "resolves") for r in _split(resolves)]
        + [(s, "supersedes") for s in _split(supersedes)]
        + [(r, "explicit") for r in related]
    )
    return slug, node, edges_raw


def main():
    if not MEMORY_ROOT.exists():
        print(f"Memory root not found: {MEMORY_ROOT}", file=sys.stderr)
        sys.exit(1)

    nodes = {}
    raw_edges = []  # (from_slug, to_raw, kind)

    files = sorted(MEMORY_ROOT.glob("*.md"))
    skipped = []
    for f in files:
        if f.name == "MEMORY.md":
            continue
        try:
            slug, node, edges_raw = parse_file(f)
            if slug in nodes:
                # Collision: keep the first (alphabetical); note in description
                skipped.append(f.name)
                continue
            nodes[slug] = node
            for target_raw, kind in edges_raw:
                raw_edges.append((slug, target_raw.lower().replace(" ", "-"), kind))
        except Exception as e:
            skipped.append(f"{f.name}: {e}")

    # Resolve edges — keep edges where target slug exists.
    # Node slugs and link targets mix "-" / "_" separators and some links
    # carry a trailing ".md"; normalize both sides so a reference resolves
    # regardless of separator style or file-extension suffix.
    def _norm(s):
        return s.lower().removesuffix(".md").replace("_", "-").strip("-")

    all_slugs = set(nodes.keys())
    norm_to_slug = {}
    for slug in all_slugs:
        norm_to_slug.setdefault(_norm(slug), slug)  # first-wins on collision
    # Links are frequently written as the target's FILENAME stem (which often
    # carries a date), while the node is keyed by its `name:` frontmatter slug
    # (often a shorter title). Index file stems too so filename-style links
    # resolve; name-slug entries above take precedence on any collision.
    for slug, node in nodes.items():
        norm_to_slug.setdefault(_norm(node["path"]), slug)
    edges = []
    dangling = defaultdict(list)
    for from_slug, to_slug, kind in raw_edges:
        if to_slug in all_slugs:
            edges.append({"from": from_slug, "to": to_slug, "kind": kind})
        elif _norm(to_slug) in norm_to_slug:
            edges.append({"from": from_slug, "to": norm_to_slug[_norm(to_slug)], "kind": kind})
        else:
            dangling[from_slug].append(to_slug)

    # Summary
    by_type = defaultdict(int)
    by_status = defaultdict(int)
    for n in nodes.values():
        by_type[n["type"]] += 1
        by_status[n["status"]] += 1

    graph = {
        "schema": "1.1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "memory_root": str(MEMORY_ROOT),
        "summary": {
            "nodes": len(nodes),
            "edges": len(edges),
            "dangling_links": sum(len(v) for v in dangling.values()),
            "by_type": dict(by_type),
            "by_status": dict(by_status),
            "skipped": skipped,
        },
        "nodes": nodes,
        "edges": edges,
    }

    OUTPUT.write_text(json.dumps(graph, indent=2))
    s = graph["summary"]
    print(
        f"Built memory graph: {s['nodes']} nodes, {s['edges']} edges "
        f"({s['dangling_links']} dangling links) → {OUTPUT}"
    )
    if s["by_type"]:
        print("  Types:  " + "  ".join(f"{k}={v}" for k, v in sorted(s["by_type"].items())))
    if s["by_status"]:
        print("  Status: " + "  ".join(f"{k}={v}" for k, v in sorted(s["by_status"].items())))
    if skipped:
        print(f"  Skipped ({len(skipped)}): {skipped[:5]}{'...' if len(skipped)>5 else ''}")


if __name__ == "__main__":
    main()
