#!/usr/bin/env python3
"""ZsirafVision csatornateszt.

Minden csatornát (public/channels.json) végigpróbál a Cloudflare Workeren keresztül
(és HTTPS esetén közvetlenül is): playlist -> (al-playlist) -> első szegmens.
A Worker IP-címes / egyedi portos csatornáknál 302-vel a Render proxyhoz irányít,
a szkript ezt automatikusan követi.

Használat (a repó gyökeréből):
    python3 tools/channel_test.py                 # összesítés + hibás csatornák
    WORKER=https://sajat-worker.workers.dev python3 tools/channel_test.py
    python3 tools/channel_test.py --json out.json # teljes eredmény JSON-ba

Eredmény típusok: OK = szegmens is letölthető, playlist-only = a playlist jön, de
szegmens nem / üres, fail = hiba (HTTP kód vagy kivétel neve).
Nem igényel titkot; Origin fejlécet nem küld.
"""
import concurrent.futures as cf
import json
import os
import re
import sys
import threading
import urllib.parse as up
import urllib.request
from collections import Counter

W = os.environ.get("WORKER", "https://zsirafvision-proxy.gamsgoworld.workers.dev").rstrip("/")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAST = threading.local()


def get(u, n=4000):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=15)
        LAST.u = r.url
        return r.status, r.read(n).decode("latin1")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return "ERR:" + type(e).__name__, ""


def unwrap(u):
    """Régi (Vercel) proxy-linkekből kiszedi az eredeti URL-t és UA-t."""
    if re.match(r"^https?://[^/]+/api/proxy\?", u):
        q = up.parse_qs(up.urlsplit(u).query)
        return q.get("url", [u])[0], q.get("ua", [""])[0]
    return u, ""


def prox(raw, ua=""):
    p = {"url": raw}
    if ua:
        p["ua"] = ua
    return W + "/api/proxy?" + up.urlencode(p)


def follow(url, depth=0):
    s, b = get(url)
    if s != 200:
        return "fail", s
    if "#EXTM3U" not in b:
        return "fail", "not-m3u8"
    lines = [l.strip() for l in b.splitlines() if l.strip() and not l.startswith("#")]
    if not lines:
        return "playlist-only", "empty"
    nxt = lines[0]
    if not nxt.startswith("http"):
        nxt = up.urljoin(LAST.u, nxt)
    if ".m3u8" in nxt.split("?")[0] or ("m3u8" in nxt and depth == 0):
        return follow(nxt, depth + 1) if depth < 2 else ("playlist-only", "deep")
    s2, _ = get(nxt, 2000)
    return ("OK", 200) if s2 in (200, 206) else ("playlist-only", s2)


def test(c):
    raw, ua = unwrap(c["url"])
    w = follow(prox(raw, ua))
    d = follow(raw) if raw.startswith("https") else ("n/a", "http")
    return {"name": c["name"], "url": raw, "worker": list(w), "direct": list(d)}


def main():
    ch = json.load(open(os.path.join(ROOT, "public", "channels.json"), encoding="utf-8"))
    with cf.ThreadPoolExecutor(24) as ex:
        R = list(ex.map(test, ch))
    print("worker", dict(Counter(r["worker"][0] for r in R)))
    print("direct", dict(Counter(r["direct"][0] for r in R)))
    for r in R:
        if r["worker"][0] != "OK":
            print(r["name"], "|", r["url"][:70], "| W", tuple(r["worker"]), "| D", tuple(r["direct"]))
    if "--json" in sys.argv:
        out = sys.argv[sys.argv.index("--json") + 1]
        json.dump(R, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
