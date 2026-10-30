# ZsirafVision – Változásnapló

A korábbi verziók részletes leírása a README „Verziótörténet” fejezetében található.

### [v4.3] - 2026-10-30
* **Fix**: **Átállás Vercelről Cloudflare Workerre** – a Vercel proxy `402 DEPLOYMENT_DISABLED` hibát adott (elfogyott az ingyenes keret), ezért nem indult egy csatorna sem és a hibajelentő sem működött.
* **Új**: `cloudflare-worker/worker.js` teljes backend: `/api/proxy` (M3U8 átírás, Range/206, CORS), `/api/report` (Cloudflare KV, IP-nkénti limit: 5 db / 10 perc, 90 napos megőrzés, GET-tel listázható), `/api/stats`, `/health`.
* **Biztonság**: a proxy csak ismert csatorna-hostokat enged teljesen; ismeretlen hostról csak média URL-t/tartalmat (m3u8, ts, mp4…), belső/privát IP-ket tilt.
* **Új**: `app.js` – egyetlen `PROXY_BASE` konstans; a régi Vercel linkeket a lejátszó automatikusan átírja. Tartalék: ha a Worker nem elérhető, HTTPS + CORS streameknél közvetlen lejátszás.
* **Update**: hls.js rögzítve `1.7.4`-re (`@latest` helyett); Service Worker cache `zsirafvision-v4.3`.

