#!/usr/bin/env python3
"""Query the memory graph.

Usage:
  --search TERM          Full-text search across name + description + path
  --related-to SLUG      Show all nodes linked to/from a given slug
  --status STATUS        Filter by status (active, stale, shipped, resolved, ...)
  --type TYPE            Filter by type (user, feedback, project, reference)
  --expires-before DATE  Nodes with expires.date before YYYY-MM-DD
  --orphans              Nodes with no edges (in or out)
  --summary              Print graph summary only
"""

import argparse
import json
import sys
from pathlib import Path

GRAPH = Path(__file__).resolve().parent.parent / "projects" / "-home-arrenchulz" / "memory" / "memory_graph.json"
MEMORY_ROOT = GRAPH.parent


def load():
    if not GRAPH.exists():
        print(f"Graph not found: {GRAPH}\nRun build_memory_graph.py first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(GRAPH.read_text())


def fmt_node(slug, node, *, indent=""):
    status = node.get("status", "active")
    mem_type = node.get("type", "?")
    expires = node.get("expires", {})
    exp_str = f"  [expires: {expires['date']}]" if expires.get("date") else ""
    return (
        f"{indent}[{mem_type}/{status}] {slug}{exp_str}\n"
        f"{indent}  {node.get('description', '(no description)')}\n"
        f"{indent}  → {node.get('path', '')}"
    )


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--search", metavar="TERM")
    ap.add_argument("--related-to", metavar="SLUG")
    ap.add_argument("--status", metavar="STATUS")
    ap.add_argument("--type", metavar="TYPE", dest="mem_type")
    ap.add_argument("--expires-before", metavar="DATE")
    ap.add_argument("--orphans", action="store_true")
    ap.add_argument("--summary", action="store_true")
    args = ap.parse_args()

    g = load()
    nodes = g["nodes"]
    edges = g["edges"]
    s = g["summary"]

    if args.summary or not any([args.search, args.related_to, args.status,
                                  args.mem_type, args.expires_before, args.orphans]):
        print(f"Memory graph — {g['generated_at'][:19]}")
        print(f"  {s['nodes']} nodes  {s['edges']} edges  ({s['dangling_links']} dangling links)")
        print("  Types:  " + "  ".join(f"{k}={v}" for k, v in sorted(s["by_type"].items())))
        print("  Status: " + "  ".join(f"{k}={v}" for k, v in sorted(s["by_status"].items())))
        if args.summary:
            return

    results = dict(nodes)  # start with all, then filter

    if args.search:
        term = args.search.lower()
        results = {
            slug: n for slug, n in results.items()
            if term in slug.lower()
            or term in n.get("name", "").lower()
            or term in n.get("description", "").lower()
            or term in n.get("path", "").lower()
        }

    if args.status:
        results = {s: n for s, n in results.items() if n.get("status") == args.status}

    if args.mem_type:
        results = {s: n for s, n in results.items() if n.get("type") == args.mem_type}

    if args.expires_before:
        results = {
            s: n for s, n in results.items()
            if n.get("expires", {}).get("date") and n["expires"]["date"] <= args.expires_before
        }

    if args.orphans:
        connected = set()
        for e in edges:
            connected.add(e["from"])
            connected.add(e["to"])
        results = {s: n for s, n in results.items() if s not in connected}

    if args.related_to:
        slug = args.related_to.lower().replace(" ", "-")
        linked = set()
        for e in edges:
            if e["from"] == slug:
                linked.add(e["to"])
            if e["to"] == slug:
                linked.add(e["from"])
        if slug in nodes:
            print(f"\nNode: {fmt_node(slug, nodes[slug])}")
        else:
            print(f"Slug '{slug}' not found in graph.")
        if linked:
            print(f"\nLinked ({len(linked)}):")
            for s in sorted(linked):
                if s in nodes:
                    print(fmt_node(s, nodes[s], indent="  "))
        else:
            print("  (no edges)")
        return

    if not results:
        print("No matches.")
        return

    print(f"\n{len(results)} result(s):")
    for slug in sorted(results):
        print(fmt_node(slug, results[slug]))
        print()


if __name__ == "__main__":
    main()
