"""Point a Vercel hostname at the READY deployment for a git SHA."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.request

TEAM = "team_RQPpqkxaimR4vreszcEEcTOT"
PROJECT = "prj_0d8PBne2gIq3AHSiGQy6MERo26g2"


def load(url: str, data: dict | None = None):
    token = os.environ["VERCEL_TOKEN"]
    req = urllib.request.Request(
        url,
        data=None if data is None else json.dumps(data).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="GET" if data is None else "POST",
    )
    with urllib.request.urlopen(req) as res:
        return json.load(res)


def main() -> int:
    if len(sys.argv) < 3:
        print("usage: point-vercel-alias.py <hostname> <git-sha>")
        return 2

    hostname, sha = sys.argv[1], sys.argv[2]
    production = "--production" in sys.argv
    query = f"projectId={PROJECT}&teamId={TEAM}&limit=15"
    if production:
        query += "&target=production"

    dep = None
    for _ in range(20):
        listing = load(f"https://api.vercel.com/v6/deployments?{query}")
        for item in listing.get("deployments", []):
            commit = (item.get("meta") or {}).get("githubCommitSha", "")
            if item.get("readyState") == "READY" and commit == sha:
                dep = item
                break
        if dep:
            break
        time.sleep(15)

    if not dep:
        raise SystemExit(f"No READY deployment for {sha}")

    load(
        f"https://api.vercel.com/v2/deployments/{dep['uid']}/aliases?teamId={TEAM}",
        {"alias": hostname},
    )
    print(f"pointed {hostname} at {dep.get('url')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
