#!/usr/bin/env python3
"""
ZsirafVision - Videoton Retro IPTV Server & Stream Proxy
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import ssl
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PORT", 8888))
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

# Disable SSL verification for misconfigured / self-signed IPTV stream certificates
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

class ZsirafVisionHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS for all responses
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        # Proxy endpoint: /api/proxy?url=<target_url>&ua=<ua>&ref=<ref>
        if parsed.path == "/api/proxy":
            query = urllib.parse.parse_qs(parsed.query)
            target_url = query.get("url", [None])[0]
            if not target_url:
                self.send_error(400, "Missing 'url' query parameter")
                return

            custom_ua = query.get("ua", [DEFAULT_UA])[0]
            custom_ref = query.get("ref", [None])[0]
            self.handle_proxy(target_url, custom_ua, custom_ref)
            return

        # Serve static files
        return super().do_GET()

    def handle_proxy(self, target_url, ua, ref):
        headers = {"User-Agent": ua or DEFAULT_UA}
        if ref:
            headers["Referer"] = ref

        req = urllib.request.Request(target_url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
                content_type = resp.headers.get("Content-Type", "application/octet-stream")
                status = resp.status
                body = resp.read()

                # If this is an M3U8 playlist, rewrite URLs to proxy through this server
                if "mpegurl" in content_type.lower() or target_url.endswith(".m3u8") or b"#EXTM3U" in body[:100]:
                    try:
                        text = body.decode("utf-8", errors="replace")
                        rewritten_lines = []
                        for line in text.splitlines():
                            stripped = line.strip()
                            if stripped and not stripped.startswith("#"):
                                # Resolve relative URL against current target_url
                                resolved = urllib.parse.urljoin(target_url, stripped)
                                # Encode for proxy
                                proxy_url = f"/api/proxy?url={urllib.parse.quote(resolved, safe='')}"
                                if ua and ua != DEFAULT_UA:
                                    proxy_url += f"&ua={urllib.parse.quote(ua, safe='')}"
                                if ref:
                                    proxy_url += f"&ref={urllib.parse.quote(ref, safe='')}"
                                rewritten_lines.append(proxy_url)
                            elif stripped.startswith('#EXT-X-KEY:') and 'URI="' in stripped:
                                # Rewrite encryption key URI
                                def replace_key_uri(match):
                                    key_uri = match.group(1)
                                    resolved_key = urllib.parse.urljoin(target_url, key_uri)
                                    p_key = f"/api/proxy?url={urllib.parse.quote(resolved_key, safe='')}"
                                    return f'URI="{p_key}"'
                                import re
                                line = re.sub(r'URI="([^"]+)"', replace_key_uri, line)
                                rewritten_lines.append(line)
                            else:
                                rewritten_lines.append(line)
                        body = "\n".join(rewritten_lines).encode("utf-8")
                        content_type = "application/vnd.apple.mpegurl"
                    except Exception as ex:
                        print(f"Error rewriting M3U8: {ex}", file=sys.stderr)

                self.send_response(status)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)

        except Exception as e:
            err_msg = f"Proxy error fetching {target_url}: {e}"
            print(err_msg, file=sys.stderr)
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(err_msg.encode("utf-8"))

def run():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), ZsirafVisionHandler)
    print("=" * 60)
    print(f"📺 ZsirafVision Videoton Retro TV elindult!")
    print(f"🔗 Nyisd meg a böngészőben: http://localhost:{PORT}")
    print("=" * 60)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nSzerver leállítva.")
        server.server_close()

if __name__ == "__main__":
    run()
