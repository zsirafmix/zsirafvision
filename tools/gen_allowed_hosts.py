#!/usr/bin/env python3
"""ZsirafVision v4.5 – public/allowed_hosts.json generálása.
A Worker (cloudflare-worker/worker.js) és a Render proxy (server.py) is ezt használja.
Futtatás a repó gyökeréből:  python3 tools/gen_allowed_hosts.py  (utána Worker újratelepítés)
"""
import json, re, urllib.request, urllib.parse as up, os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
WORLD_M3U = "https://iptv-org.github.io/iptv/index.country.m3u"

def unwrap(u):
    if re.match(r"^https?://[^/]+/api/proxy\?", u):
        return up.parse_qs(up.urlsplit(u).query).get("url", [u])[0]
    return u

def main():
    hosts = set()
    for f in ("public/channels.json", "public/adult.json"):
        p = os.path.join(ROOT, f)
        if not os.path.exists(p):
            continue
        d = json.load(open(p, encoding="utf-8"))
        d = d if isinstance(d, list) else d.get("channels", [])
        for c in d:
            h = up.urlsplit(unwrap(c.get("url", ""))).hostname
            if h:
                hosts.add(h.lower())
    world = set()
    text = urllib.request.urlopen(WORLD_M3U, timeout=60).read().decode("utf-8", "replace")
    for line in text.splitlines():
        if line.startswith("http"):
            h = up.urlsplit(line.strip()).hostname
            if h:
                world.add(h.lower())
    out = {
        "_comment": "v4.5 – Engedélyezett stream hostok (channels.json + adult.json + iptv-org Világ lista). Generálva: python3 tools/gen_allowed_hosts.py",
        "channels": sorted(hosts),
        "world": sorted(world - hosts),
    }
    with open(os.path.join(ROOT, "public/allowed_hosts.json"), "w", encoding="utf-8") as fh:
        json.dump(out, fh, indent=0)
    print(f"channels: {len(out['channels'])}, world: {len(out['world'])}")

if __name__ == "__main__":
    main()
