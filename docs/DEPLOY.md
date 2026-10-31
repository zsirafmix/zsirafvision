# Telepítés és üzemeltetés

## 1. Front-end – GitHub Pages
A `main` ágra pusholt változás automatikusan kikerül: `https://zsirafmix.github.io/zsirafvision/public/`.
Verzióváltáskor léptesd a `?v=` tageket és a `public/sw.js` cache nevét (különben a PWA a régit mutatja).

## 2. Cloudflare Worker
```bash
cd cloudflare-worker
npx wrangler login                       # egyszer
npx wrangler kv namespace create REPORTS # egyszer, az id a wrangler.toml-ba
npx wrangler secret put REPORT_TOKEN     # véletlen érték
npx wrangler secret put RENDER_SIGN_KEY  # ugyanaz, mint a Renderen
npx wrangler deploy
```
- Keep-warm: `wrangler.toml` → `[triggers] crons = ["*/10 * * * *"]` – 10 percenként meghívja a Render `/health`-et.
- Ingyenes keret: 100 000 kérés / nap; KV írás 1000 / nap (ezért a proxy limit memóriában van).

## 3. Render proxy
- Web Service, Python, start: `python3 server.py` (a `PORT` env-et a Render adja).
- Környezeti változók:
  - `RENDER_SIGN_KEY` – kötelező (nélküle aláírás nélkül, csak allowlist alapján enged).
  - `TLS_INSECURE_HOSTS` – opcionális, vesszővel elválasztott hostok / `.domain` utótagok.
- Ellenőrzés: `curl https://zsirafvision-proxy2.onrender.com/health` → `OK - ZsirafVision proxy2 v4.5 (signed=yes)`.
- Ha a push után nem frissül: Dashboard → Manual Deploy → Deploy latest commit.

## 4. Allowlist frissítése
Új csatorna hosztja után: `python3 tools/gen_allowed_hosts.py`, majd commit + Worker deploy (a Worker buildbe kerül a JSON).

## 5. Hibajelentések kiolvasása
```bash
curl -H "Authorization: Bearer $REPORT_TOKEN" "https://zsirafvision-proxy.gamsgoworld.workers.dev/api/report?limit=50"
npx wrangler kv key list --binding REPORTS --remote
```

## 6. Csatornateszt
```bash
python3 tools/channel_test.py              # összesítés + hibás csatornák
python3 tools/channel_test.py --json r.json
```


## Nézőszámláló telepítése (v4.6.1)

A `cloudflare-worker/wrangler.toml` tartalmazza a Durable Object kötést és migrációt:
```toml
[[durable_objects.bindings]]
name = "VIEWERS"
class_name = "ViewerCounter"

[[migrations]]
tag = "v4.6-viewers"
new_sqlite_classes = ["ViewerCounter"]
```
Telepítés: `cd cloudflare-worker && npx wrangler deploy` (ingyenes csomagban `new_sqlite_classes` kell, a régi `new_classes` fizetős).
Ellenőrzés:
```bash
curl -s -H 'Origin: https://zsirafmix.github.io' -X POST https://zsirafvision-proxy.gamsgoworld.workers.dev/api/heartbeat -d '{"sid":"teszt0000000000001","ch":"M1"}'
curl -s https://zsirafvision-proxy.gamsgoworld.workers.dev/api/viewers
```
Új titok vagy környezeti változó nem kell.


## v4.7.0 – új proxy backend
1. Telepítsd a repót Dockerfile-lal (env: `PROXY_ONLY=1`, `RENDER_SIGN_KEY`).
2. Ellenőrizd: `/health` → `signed=yes`.
3. Vedd fel a `cloudflare-worker/wrangler.toml` `PROXY_BACKENDS` listájába, `WRANGLER_CACHE_DIR=/tmp/wc npx wrangler deploy`.
Szolgáltatónkénti lépések: [PROXY_BACKENDS.md](PROXY_BACKENDS.md).

## v4.7.1 – Deno Deploy proxy
```bash
curl -fsSL https://deno.land/install.sh | sh
cd deno-proxy
export DENO_DEPLOY_TOKEN=...            # console.deno.com → Account → Access tokens
# első alkalommal (az app már létezik: zsirafvision-proxy):
deno deploy create . -y --org zsirafvision --source local --app zsirafvision-proxy --runtime-mode dynamic --entrypoint main.ts --region eu
deno deploy env add --secret RENDER_SIGN_KEY "<ugyanaz, mint a Workeren/Renderen>" -y
# minden kódváltozás után:
deno deploy . --prod -y
curl https://zsirafvision-proxy.zsirafvision.deno.net/   # OK - ZsirafVision proxy v4.7.1 (signed=yes)
```
A `deno.json` tartalmazza az org/app nevét. Helyi futtatás: `RENDER_SIGN_KEY=... deno run -A main.ts` (port 8000).
Az `allowed_hosts.json` másolata a `deno-proxy/` mappában van – allowlist frissítésekor ezt is másold át.
Új backend felvétele: `cloudflare-worker/wrangler.toml` → `PROXY_BACKENDS`, majd `wrangler deploy`.
