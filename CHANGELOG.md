# ZsirafVision – Változásnapló

A korábbi verziók részletes leírása a README „Verziótörténet” fejezetében található.

### [v4.4] - 2026-10-30
* **Új**: **Két proxys architektúra.** A Cloudflare Worker nem tud IP-címes hostot (CF 1003 hiba) és nem szabványos portot (pl. 1344, 2443, 8890) elérni, ezért ezeket a kéréseket 302-es átirányítással a Renderen futó második proxyhoz küldi: `https://zsirafvision-proxy2.onrender.com` (`server.py`). Ez hozza vissza az RTL, TV2, M1–M5, Duna, Viasat stb. csatornákat.
* **Új**: Worker cron (10 percenként) – ébren tartja a Render proxyt, hogy ne legyen ~60 mp-es hidegindítás.
* **Fix**: `server.py` – az M3U8 átírás abszolút URL-eket ad (Host / X-Forwarded-Proto alapján), `/health` végpont, belső/privát IP-k tiltása (SSRF védelem).
* **Update**: verzió 4.4 (UI, Service Worker cache `zsirafvision-v4.4`, `?v=` tagek).

### [v4.3] - 2026-10-30
* **Fix**: **Átállás Vercelről Cloudflare Workerre** – a Vercel proxy `402 DEPLOYMENT_DISABLED` hibát adott (elfogyott az ingyenes keret), ezért nem indult egy csatorna sem és a hibajelentő sem működött.
* **Új**: `cloudflare-worker/worker.js` teljes backend: `/api/proxy` (M3U8 átírás, Range/206, CORS), `/api/report` (Cloudflare KV, IP-nkénti limit: 5 db / 10 perc, 90 napos megőrzés, GET-tel listázható), `/api/stats`, `/health`.
* **Biztonság**: a proxy csak ismert csatorna-hostokat enged teljesen; ismeretlen hostról csak média URL-t/tartalmat (m3u8, ts, mp4…), belső/privát IP-ket tilt.
* **Új**: `app.js` – egyetlen `PROXY_BASE` konstans; a régi Vercel linkeket a lejátszó automatikusan átírja. Tartalék: ha a Worker nem elérhető, HTTPS + CORS streameknél közvetlen lejátszás.
* **Update**: hls.js rögzítve `1.7.4`-re (`@latest` helyett); Service Worker cache `zsirafvision-v4.3`.

