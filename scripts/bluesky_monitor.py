#!/usr/bin/env python3
"""Bluesky account monitor — observation-only AT Protocol poller.

Fetches profile, recent posts, and (with app-password auth) notifications.
Diffs against a local state file and prints a structured brief.

Credentials (optional — public profile/feed work without them):
  BSKY_HANDLE          handle or DID to monitor (required)
  BSKY_APP_PASSWORD    Bluesky app password (enables notifications)
  BSKY_PDS             PDS host, default https://bsky.social
  BSKY_STATE_PATH      state JSON path (default ~/.claude/bluesky-monitor/state.json)

Usage:
  python3 scripts/bluesky_monitor.py
  python3 scripts/bluesky_monitor.py --handle example.bsky.social --dry-run
  python3 scripts/bluesky_monitor.py --json
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PUBLIC_API = "https://public.api.bsky.app"
DEFAULT_PDS = "https://bsky.social"
DEFAULT_STATE = Path.home() / ".claude" / "bluesky-monitor" / "state.json"
USER_AGENT = "claude-memory-bluesky-monitor/1.0 (+https://github.com/Warrenpoobear/claude-memory)"


class BlueskyError(RuntimeError):
    pass


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _http_json(
    url: str,
    *,
    method: str = "GET",
    body: dict[str, Any] | None = None,
    token: str | None = None,
    timeout: float = 20.0,
) -> dict[str, Any]:
    data = None
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        raise BlueskyError(f"HTTP {e.code} for {url}: {detail}") from e
    except urllib.error.URLError as e:
        raise BlueskyError(f"Network error for {url}: {e.reason}") from e


def get_profile(actor: str) -> dict[str, Any]:
    q = urllib.parse.urlencode({"actor": actor})
    return _http_json(f"{PUBLIC_API}/xrpc/app.bsky.actor.getProfile?{q}")


def get_author_feed(actor: str, limit: int = 20) -> list[dict[str, Any]]:
    q = urllib.parse.urlencode(
        {
            "actor": actor,
            "limit": str(limit),
            "filter": "posts_with_replies",
        }
    )
    data = _http_json(f"{PUBLIC_API}/xrpc/app.bsky.feed.getAuthorFeed?{q}")
    return data.get("feed", [])


def create_session(pds: str, identifier: str, password: str) -> dict[str, Any]:
    return _http_json(
        f"{pds.rstrip('/')}/xrpc/com.atproto.server.createSession",
        method="POST",
        body={"identifier": identifier, "password": password},
    )


def list_notifications(pds: str, token: str, limit: int = 50) -> list[dict[str, Any]]:
    q = urllib.parse.urlencode({"limit": str(limit)})
    data = _http_json(
        f"{pds.rstrip('/')}/xrpc/app.bsky.notification.listNotifications?{q}",
        token=token,
    )
    return data.get("notifications", [])


def _post_summary(item: dict[str, Any]) -> dict[str, Any]:
    post = item.get("post") or {}
    record = post.get("record") or {}
    author = post.get("author") or {}
    text = (record.get("text") or "").replace("\n", " ").strip()
    if len(text) > 160:
        text = text[:157] + "..."
    return {
        "uri": post.get("uri"),
        "cid": post.get("cid"),
        "indexedAt": post.get("indexedAt"),
        "likeCount": post.get("likeCount", 0),
        "replyCount": post.get("replyCount", 0),
        "repostCount": post.get("repostCount", 0),
        "quoteCount": post.get("quoteCount", 0),
        "author": author.get("handle"),
        "text": text,
        "isReply": bool(record.get("reply")),
    }


def _notif_summary(n: dict[str, Any]) -> dict[str, Any]:
    author = n.get("author") or {}
    record = n.get("record") or {}
    text = ""
    if isinstance(record, dict):
        text = (record.get("text") or "").replace("\n", " ").strip()
        if len(text) > 120:
            text = text[:117] + "..."
    return {
        "uri": n.get("uri"),
        "reason": n.get("reason"),
        "isRead": n.get("isRead"),
        "indexedAt": n.get("indexedAt"),
        "author": author.get("handle"),
        "authorDisplayName": author.get("displayName"),
        "text": text,
    }


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def save_state(path: Path, state: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(state, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    tmp.replace(path)


def diff_monitor(
    *,
    handle: str,
    profile: dict[str, Any],
    posts: list[dict[str, Any]],
    notifications: list[dict[str, Any]] | None,
    prev: dict[str, Any],
) -> dict[str, Any]:
    baseline = not bool(prev)
    post_rows = [_post_summary(p) for p in posts]
    post_uris = {p["uri"] for p in post_rows if p.get("uri")}
    prev_uris = set(prev.get("post_uris") or [])
    # First run seeds state only — do not treat the whole feed as "new".
    new_posts = (
        []
        if baseline
        else [p for p in post_rows if p.get("uri") and p["uri"] not in prev_uris]
    )

    prev_profile = prev.get("profile") or {}
    profile_changes: list[str] = []
    if not baseline:
        for key, label in (
            ("displayName", "display name"),
            ("description", "bio"),
            ("avatar", "avatar"),
            ("banner", "banner"),
            ("handle", "handle"),
        ):
            old = prev_profile.get(key)
            new = profile.get(key)
            if old is not None and new is not None and old != new:
                profile_changes.append(label)

    follower_delta = None
    if (
        not baseline
        and "followersCount" in prev_profile
        and "followersCount" in profile
    ):
        follower_delta = profile["followersCount"] - prev_profile["followersCount"]

    notif_rows = [_notif_summary(n) for n in (notifications or [])]
    prev_notif = set(prev.get("notification_uris") or [])
    new_notifs = (
        []
        if baseline
        else [n for n in notif_rows if n.get("uri") and n["uri"] not in prev_notif]
    )

    reason_counts: dict[str, int] = {}
    for n in new_notifs:
        reason = n.get("reason") or "unknown"
        reason_counts[reason] = reason_counts.get(reason, 0) + 1

    # Engagement spikes vs prior snapshot of same uris
    prev_engagement = {
        e["uri"]: e for e in (prev.get("posts") or []) if e.get("uri")
    }
    spikes: list[dict[str, Any]] = []
    for p in post_rows:
        uri = p.get("uri")
        if not uri or uri not in prev_engagement:
            continue
        old = prev_engagement[uri]
        like_delta = (p.get("likeCount") or 0) - (old.get("likeCount") or 0)
        reply_delta = (p.get("replyCount") or 0) - (old.get("replyCount") or 0)
        if like_delta >= 5 or reply_delta >= 3:
            spikes.append(
                {
                    "uri": uri,
                    "text": p.get("text"),
                    "likeDelta": like_delta,
                    "replyDelta": reply_delta,
                }
            )

    severity = "OK"
    if profile_changes or any(n.get("reason") == "mention" for n in new_notifs):
        severity = "ATTENTION"
    if new_posts and prev_uris:
        # New posts from watched account — surface; may be expected
        severity = "ATTENTION" if severity == "OK" else severity
    if any(k in profile_changes for k in ("handle", "avatar", "bio", "display name")):
        # Possible account compromise signals when unexpected
        if profile_changes:
            severity = "ALERT"

    return {
        "asOf": _now_iso(),
        "handle": profile.get("handle") or handle,
        "did": profile.get("did"),
        "severity": severity,
        "profile": {
            "displayName": profile.get("displayName"),
            "description": profile.get("description"),
            "avatar": profile.get("avatar"),
            "banner": profile.get("banner"),
            "handle": profile.get("handle"),
            "followersCount": profile.get("followersCount"),
            "followsCount": profile.get("followsCount"),
            "postsCount": profile.get("postsCount"),
        },
        "deltas": {
            "followerDelta": follower_delta,
            "newPostCount": len(new_posts),
            "newNotificationCount": len(new_notifs),
            "profileChanges": profile_changes,
            "notificationReasons": reason_counts,
        },
        "newPosts": new_posts[:10],
        "newNotifications": new_notifs[:25],
        "engagementSpikes": spikes[:10],
        "recentPosts": post_rows[:10],
        "authMode": "authenticated" if notifications is not None else "public",
        "baseline": baseline,
        "_state": {
            "profile": {
                "displayName": profile.get("displayName"),
                "description": profile.get("description"),
                "avatar": profile.get("avatar"),
                "banner": profile.get("banner"),
                "handle": profile.get("handle"),
                "followersCount": profile.get("followersCount"),
                "followsCount": profile.get("followsCount"),
                "postsCount": profile.get("postsCount"),
            },
            "post_uris": sorted(post_uris | prev_uris),
            "posts": post_rows[:40],
            "notification_uris": sorted(
                {n["uri"] for n in notif_rows if n.get("uri")} | prev_notif
            )[-500:],
            "lastRunAt": _now_iso(),
        },
    }


def format_brief(report: dict[str, Any]) -> str:
    p = report["profile"]
    d = report["deltas"]
    lines = [
        f"BLUESKY MONITOR — {report['asOf']}",
        f"Account:  @{report['handle']}  ({report.get('did')})",
        f"Severity: {report['severity']}  |  Mode: {report['authMode']}"
        + ("  |  BASELINE (first run)" if report.get("baseline") else ""),
        "",
        "PROFILE",
        f"  Name:      {p.get('displayName') or '(none)'}",
        f"  Followers: {p.get('followersCount')}  (Δ {d.get('followerDelta')})",
        f"  Following: {p.get('followsCount')}  Posts: {p.get('postsCount')}",
    ]
    if d.get("profileChanges"):
        lines.append(f"  Changes:   {', '.join(d['profileChanges'])}")
    else:
        lines.append("  Changes:   none")

    lines += ["", f"NEW POSTS ({d.get('newPostCount', 0)})"]
    if report.get("baseline"):
        lines.append("  (baseline — seeding state; not alerting on existing feed)")
        for post in (report.get("recentPosts") or [])[:3]:
            kind = "reply" if post.get("isReply") else "post"
            lines.append(
                f"  sample [{kind}] — {post.get('text') or '(no text)'}"
            )
    elif report["newPosts"]:
        for post in report["newPosts"]:
            kind = "reply" if post.get("isReply") else "post"
            lines.append(
                f"  [{kind}] ♡{post.get('likeCount')} ↩{post.get('replyCount')} "
                f"↻{post.get('repostCount')} — {post.get('text') or '(no text)'}"
            )
    else:
        lines.append("  (none since last check)")

    lines += ["", f"NOTIFICATIONS ({d.get('newNotificationCount', 0)})"]
    if report["authMode"] != "authenticated":
        lines.append("  (skipped — set BSKY_APP_PASSWORD for mentions/likes/follows)")
    elif report.get("baseline"):
        lines.append("  (baseline — seeding notification URIs; not alerting)")
    elif report["newNotifications"]:
        reasons = d.get("notificationReasons") or {}
        if reasons:
            summary = ", ".join(f"{k}={v}" for k, v in sorted(reasons.items()))
            lines.append(f"  Reasons: {summary}")
        for n in report["newNotifications"][:15]:
            unread = "NEW" if not n.get("isRead") else "seen"
            snippet = n.get("text") or ""
            extra = f" — {snippet}" if snippet else ""
            lines.append(
                f"  [{n.get('reason')}/{unread}] @{n.get('author')}{extra}"
            )
    else:
        lines.append("  (none since last check)")

    lines += ["", f"ENGAGEMENT SPIKES ({len(report.get('engagementSpikes') or [])})"]
    if report.get("baseline"):
        lines.append("  (baseline — no prior engagement to compare)")
    elif report.get("engagementSpikes"):
        for s in report["engagementSpikes"]:
            lines.append(
                f"  +♡{s.get('likeDelta')} +↩{s.get('replyDelta')} — "
                f"{s.get('text') or '(no text)'}"
            )
    else:
        lines.append("  (none)")

    lines += [
        "",
        "GOVERNANCE: OBSERVATION_ONLY | NO_POSTS | NO_LIKES | NO_FOLLOWS | NO_DELETES",
    ]
    return "\n".join(lines)


def run(args: argparse.Namespace) -> int:
    handle = args.handle or os.environ.get("BSKY_HANDLE")
    if not handle:
        print(
            "ERROR: set BSKY_HANDLE or pass --handle (e.g. you.bsky.social)",
            file=sys.stderr,
        )
        return 2

    state_path = Path(
        args.state
        or os.environ.get("BSKY_STATE_PATH")
        or DEFAULT_STATE
    )
    pds = args.pds or os.environ.get("BSKY_PDS") or DEFAULT_PDS
    password = args.app_password or os.environ.get("BSKY_APP_PASSWORD")

    try:
        profile = get_profile(handle)
        posts = get_author_feed(handle, limit=args.limit)
    except BlueskyError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    notifications = None
    if password:
        try:
            session = create_session(pds, handle, password)
            notifications = list_notifications(pds, session["accessJwt"], limit=50)
        except BlueskyError as e:
            print(f"WARNING: auth/notifications failed: {e}", file=sys.stderr)
            notifications = None

    prev = {} if args.reset_state else load_state(state_path)
    report = diff_monitor(
        handle=handle,
        profile=profile,
        posts=posts,
        notifications=notifications,
        prev=prev,
    )

    if not args.dry_run:
        save_state(state_path, report["_state"])

    out = {k: v for k, v in report.items() if k != "_state"}
    if args.json:
        print(json.dumps(out, indent=2))
    else:
        print(format_brief(out))
        if not args.dry_run:
            print(f"\nState written: {state_path}")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Monitor a Bluesky account (read-only)")
    p.add_argument("--handle", help="Bluesky handle or DID (or BSKY_HANDLE)")
    p.add_argument("--app-password", help="App password (or BSKY_APP_PASSWORD)")
    p.add_argument("--pds", help="PDS base URL (default https://bsky.social)")
    p.add_argument("--state", help="State file path")
    p.add_argument("--limit", type=int, default=20, help="Author feed page size")
    p.add_argument("--dry-run", action="store_true", help="Do not write state")
    p.add_argument("--reset-state", action="store_true", help="Ignore prior state")
    p.add_argument("--json", action="store_true", help="Emit JSON instead of brief")
    return p


if __name__ == "__main__":
    sys.exit(run(build_parser().parse_args()))
