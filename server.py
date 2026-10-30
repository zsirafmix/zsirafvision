#!/usr/bin/env python3
"""
ZsirafVision v4.5 – Videoton Retro IPTV szerver & stream proxy
Renderen második proxyként fut (IP-címes és nem szabványos portú streamek),
helyben pedig a public/ mappát is kiszolgálja (python3 server.py -> http://localhost:8888).

Biztonság (v4.5):
  * RENDER_SIGN_KEY környezeti változó beállítva -> CSAK a Worker (vagy e szerver) által
    HMAC-kal aláírt, le nem járt URL-eket szolgál ki (url+exp+ua+ref aláírva).
    Nincs beállítva -> host allowlist (public/allowed_hosts.json) alapján enged.
  * Belső / privát IP-k tiltása minden átirányítási lépésnél és a ténylegesen
    kapcsolódott (peer) IP-re is (DNS rebinding ellen).
  * TLS ellenőrzés bekapcsolva; csak a TLS_INSECURE_HOSTS listában lévő hostoknál kikapcsolva.
  * Méret- és időkorlát, IP-nkénti rate limit, CORS csak a saját oldalnak.
"""

import base64
import hashlib
import hmac
import ipaddress
import json
import os
import re
import socket
import ssl
import sys
import threading
import time
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

VERSION = "4.5"
PORT = int(os.environ.get("PORT", 8888))
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
SIGN_KEY = os.environ.get("RENDER_SIGN_KEY", "").encode()
SIGN_TTL = 6 * 3600

DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
# "null": a Worker 302-es átirányítása után a böngésző "Origin: null"-t küld (tainted origin)
ALLOWED_ORIGINS = {"https://zsirafmix.github.io", "null"}
LOCAL_ORIGIN_RE = re.compile(r"^http://(localhost|127\.0\.0\.1)(:\d+)?$")
MEDIA_EXT_RE = re.compile(r"\.(m3u8?|ts|aac|mp4|m4s|m4a|m4v|mp3|vtt|key|fmp4|cmfv|cmfa)(\?|$)", re.I)
MEDIA_CT_RE = re.compile(r"(mpegurl|video/|audio/|octet-stream|application/mp4|binary/octet)", re.I)
MAX_PLAYLIST = 2 * 1024 * 1024
MAX_SEGMENT = 40 * 1024 * 1024
TIMEOUT = 15
RATE_MAX = 900            # kérés / IP / perc
# Alapértelmezett kivétel: a lexanetwork.com relay-ek (:1344) tanúsítványa hibás/önaláírt.
# Elem lehet pontos host vagy ".domain" utótag. Felülírható a TLS_INSECURE_HOSTS env-vel (hozzáadódik).
TLS_INSECURE_HOSTS = {".lexanetwork.com"} | set(h.strip().lower() for h in os.environ.get("TLS_INSECURE_HOSTS", "").split(",") if h.strip())


def tls_insecure(host):
    host = (host or "").lower()
    return any(host == h or (h.startswith(".") and (host.endswith(h) or host == h[1:])) for h in TLS_INSECURE_HOSTS)


def _load_hosts():
    try:
        with open(os.path.join(PUBLIC_DIR, "allowed_hosts.json"), encoding="utf-8") as fh:
            d = json.load(fh)
        return set(d.get("channels", [])) | set(d.get("world", []))
    except Exception as e:
        print(f"allowed_hosts.json hiba: {e}", file=sys.stderr)
        return set()


ALLOWED_HOSTS = _load_hosts()
_rate = {}
_rate_lock = threading.Lock()


def rate_ok(ip):
    now = int(time.time() // 60)
    with _rate_lock:
        k = (ip, now)
        _rate[k] = _rate.get(k, 0) + 1
        if len(_rate) > 20000:
            for key in [x for x in _rate if x[1] != now]:
                _rate.pop(key, None)
        return _rate[k] <= RATE_MAX


def ip_is_bad(ip_str):
    try:
        ip = ipaddress.ip_address(ip_str.split("%")[0])
    except ValueError:
        return True
    if getattr(ip, "ipv4_mapped", None):
        ip = ip.ipv4_mapped
    return (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved
            or ip.is_multicast or ip.is_unspecified or not ip.is_global)


def host_is_bad(host):
    try:
        infos = socket.getaddrinfo(host, None)
    except Exception:
        return True
    return any(ip_is_bad(i[4][0]) for i in infos) or not infos


def sign(url, exp, ua, ref):
    msg = f"{url}|{exp}|{ua}|{ref}".encode()
    return base64.urlsafe_b64encode(hmac.new(SIGN_KEY, msg, hashlib.sha256).digest()[:18]).decode().rstrip("=")


def sig_ok(url, exp, ua, ref, sig):
    try:
        if int(exp) < time.time():
            return False
    except (TypeError, ValueError):
        return False
    return bool(sig) and hmac.compare_digest(sign(url, exp, ua, ref), sig)


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        u = urllib.parse.urlsplit(newurl)
        if u.scheme not in ("http", "https") or not u.hostname or host_is_bad(u.hostname):
            raise urllib.error.HTTPError(newurl, 403, "Tiltott átirányítás", headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _ctx(insecure):
    c = ssl.create_default_context()
    if insecure:
        c.check_hostname = False
        c.verify_mode = ssl.CERT_NONE
    return c


OPENER_SECURE = urllib.request.build_opener(SafeRedirect, urllib.request.HTTPSHandler(context=_ctx(False)))
OPENER_INSECURE = urllib.request.build_opener(SafeRedirect, urllib.request.HTTPSHandler(context=_ctx(True)))


def peer_ip(resp):
    try:
        sock = resp.fp.raw._sock
        return sock.getpeername()[0]
    except Exception:
        return None


class ZsirafVisionHandler(SimpleHTTPRequestHandler):
    server_version = "ZsirafVision/" + VERSION
    sys_version = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    # --- közös fejlécek -------------------------------------------------
    def end_headers(self):
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS or LOCAL_ORIGIN_RE.match(origin or ""):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Range, Content-Type")
            self.send_header("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        super().end_headers()

    def _text(self, code, msg):
        body = msg.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def _origin_ok(self):
        o = self.headers.get("Origin")
        return not o or o in ALLOWED_ORIGINS or LOCAL_ORIGIN_RE.match(o)

    def do_OPTIONS(self):
        self.send_response(204 if self._origin_ok() else 403)
        self.end_headers()

    def _route(self, is_head):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ("/health", "/healthz") or (parsed.path == "/" and os.environ.get("RENDER")):
            return self._text(200, f"OK - ZsirafVision proxy2 v{VERSION} (signed={'yes' if SIGN_KEY else 'no'})")
        if parsed.path == "/api/proxy":
            if not self._origin_ok():
                return self._text(403, "Tiltott origin")
            ip = (self.headers.get("X-Forwarded-For") or self.client_address[0]).split(",")[0].strip()
            if not rate_ok(ip):
                return self._text(429, "Tul sok keres")
            q = urllib.parse.parse_qs(parsed.query)
            g = lambda k: q.get(k, [""])[0]
            target = g("url")
            if not target or len(target) > 4096:
                return self._text(400, "Hianyzo vagy hibas url")
            return self.handle_proxy(target, g("ua"), g("ref"), g("exp"), g("sig"), is_head)
        if os.environ.get("RENDER"):
            return self._text(404, "Not Found")  # Renderen csak proxy, statikus oldal nincs
        return super().do_HEAD() if is_head else super().do_GET()

    def do_HEAD(self):
        self._route(True)

    def do_GET(self):
        self._route(False)

    def _base(self):
        proto = self.headers.get("X-Forwarded-Proto") or ("https" if os.environ.get("RENDER") else "http")
        host = self.headers.get("X-Forwarded-Host") or self.headers.get("Host") or f"localhost:{PORT}"
        return f"{proto.split(',')[0].strip()}://{host}"

    def _wrap(self, url, ua, ref):
        p = {"url": url}
        if ua:
            p["ua"] = ua
        if ref:
            p["ref"] = ref
        if SIGN_KEY:
            exp = str(int(time.time()) + SIGN_TTL)
            p["exp"] = exp
            p["sig"] = sign(url, exp, ua, ref)
        return f"{self._base()}/api/proxy?{urllib.parse.urlencode(p)}"

    def _allowed(self, target, ua, ref, exp, sig):
        u = urllib.parse.urlsplit(target)
        if u.scheme not in ("http", "https") or not u.hostname:
            return False, "Csak http/https"
        if host_is_bad(u.hostname):
            return False, "Belso halozati cim tiltva"
        if SIGN_KEY:
            return (True, "") if sig_ok(target, exp, ua, ref, sig) else (False, "Hianyzo vagy ervenytelen alairas")
        if u.hostname.lower() in ALLOWED_HOSTS or MEDIA_EXT_RE.search(u.path):
            return True, ""
        return False, "Nem engedelyezett host"

    def handle_proxy(self, target, ua, ref, exp, sig, is_head=False):
        ok, why = self._allowed(target, ua, ref, exp, sig)
        if not ok:
            return self._text(403, why)
        host = (urllib.parse.urlsplit(target).hostname or "").lower()
        headers = {"User-Agent": ua or DEFAULT_UA, "Accept": "*/*"}
        if ref:
            headers["Referer"] = ref
        rng = self.headers.get("Range")
        if rng:
            headers["Range"] = rng
        opener = OPENER_INSECURE if tls_insecure(host) else OPENER_SECURE
        req = urllib.request.Request(target, headers=headers, method="HEAD" if is_head else "GET")
        try:
            resp = opener.open(req, timeout=TIMEOUT)
        except urllib.error.HTTPError as e:
            return self._text(e.code if 400 <= e.code < 600 else 502, f"Upstream HTTP {e.code}")
        except Exception as e:
            return self._text(502, f"Upstream hiba: {type(e).__name__}: {str(getattr(e, 'reason', e))[:80]}")
        with resp:
            pip = peer_ip(resp)
            if pip and ip_is_bad(pip):
                return self._text(403, "Belso halozati cim tiltva (DNS)")
            final_url = resp.geturl() or target
            ct = resp.headers.get("Content-Type", "application/octet-stream")
            looks_playlist = "mpegurl" in ct.lower() or re.search(r"\.m3u8?(\?|$)", urllib.parse.urlsplit(final_url).path or "")
            if not looks_playlist and not MEDIA_CT_RE.search(ct) and not MEDIA_EXT_RE.search(urllib.parse.urlsplit(final_url).path):
                return self._text(415, "Nem media tartalom")
            clen = resp.headers.get("Content-Length")
            if clen and clen.isdigit() and int(clen) > MAX_SEGMENT:
                return self._text(413, "Tul nagy valasz")
            if is_head:
                self.send_response(resp.status)
                self.send_header("Content-Type", ct)
                if clen:
                    self.send_header("Content-Length", clen)
                self.end_headers()
                return
            if looks_playlist:
                body = resp.read(MAX_PLAYLIST + 1)
                if len(body) > MAX_PLAYLIST:
                    return self._text(413, "Tul nagy playlist")
                if b"#EXTM3U" not in body[:1024]:
                    return self._text(415, "Nem M3U8")
                body = self.rewrite(body.decode("utf-8", "replace"), final_url, ua, ref).encode("utf-8")
                self.send_response(resp.status)
                self.send_header("Content-Type", "application/vnd.apple.mpegurl")
                self.send_header("Content-Length", str(len(body)))
                self.send_header("Cache-Control", "no-cache")
                self.end_headers()
                self.wfile.write(body)
                return
            self.send_response(resp.status)
            self.send_header("Content-Type", ct)
            for k in ("Content-Length", "Content-Range", "Accept-Ranges"):
                v = resp.headers.get(k)
                if v:
                    self.send_header(k, v)
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            sent = 0
            try:
                while True:
                    chunk = resp.read(64 * 1024)
                    if not chunk:
                        break
                    sent += len(chunk)
                    if sent > MAX_SEGMENT:
                        break
                    self.wfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError):
                pass

    def rewrite(self, text, base, ua, ref):
        out = []
        for line in text.splitlines():
            s = line.strip()
            if s and not s.startswith("#"):
                out.append(self._wrap(urllib.parse.urljoin(base, s), ua, ref))
            elif s.startswith("#") and 'URI="' in s:
                out.append(re.sub(r'URI="([^"]+)"', lambda m: f'URI="{self._wrap(urllib.parse.urljoin(base, m.group(1)), ua, ref)}"', line))
            else:
                out.append(line)
        return "\n".join(out)

    def log_message(self, fmt, *args):
        if os.environ.get("ZV_DEBUG"):
            super().log_message(fmt, *args)


def run():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), ZsirafVisionHandler)
    server.daemon_threads = True
    print(f"ZsirafVision v{VERSION} fut: http://localhost:{PORT}  (alairas: {'BE' if SIGN_KEY else 'KI'}, hostok: {len(ALLOWED_HOSTS)})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()


if __name__ == "__main__":
    run()
