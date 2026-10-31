# Tartalék proxyk és automatikus átváltás (v4.7.1)

## Működés
- A Worker az IP-címes / nem szabványos portú streameket 302-vel egy Python proxyhoz (`server.py`) irányítja.
- A proxyk listája: `PROXY_BACKENDS` (wrangler.toml `[vars]`), JSON: `[{"name","url","priority"}]`.
- A 10 percenkénti cron minden backend `/health` végpontját lekéri (hiba esetén 3 mp múlva még egyszer – hidegindítás).
  Halott, ha: nem 2xx (5xx/402/429), időtúllépés, vagy a válaszban `suspend|exceeded|quota|disabled|payment` szerepel,
  vagy hiányzik a „ZsirafVision” szó (pl. a szolgáltató „felfüggesztve” oldala).
- Az állapot a KV-ba (`backend-health`) csak változáskor, egyébként óránként max. 1× íródik (ingyenes keret kímélése).
- Választás: a legkisebb prioritású egészséges szint; azonos prioritáson körbeforgatás (sávszél elosztása).
  Ha mind halott, a lista első eleme. Visszajött backend a következő cronnál újra sorba kerül.
- Állapot: `GET /health` és `GET /api/stats` (`proxyBackends`).
- Szabály: **szolgáltatónként EGY fiók** – több ingyenes fiók a keret megkerülésére tiltott.

## Új backend telepítése (bármely Docker/Procfile platform)
A repóban van `Dockerfile` (port: `$PORT`, alapból 8080) és `Procfile`. Kötelező env változók:
`PROXY_ONLY=1`, `RENDER_SIGN_KEY=<ugyanaz, mint a Workeren>`. Ellenőrzés: `https://<app>/health` → `OK - ZsirafVision proxy v4.7.x (signed=yes)`.
Utána a `PROXY_BACKENDS` listába felvenni és `npx wrangler deploy`.

## Aktív backendek (v4.7.1)
| Név | URL | Platform | Megjegyzés |
|---|---|---|---|
| render | https://zsirafvision-proxy2.onrender.com | Render (server.py, Frankfurt) | 5 GB/hó forgalom |
| back4app | https://zsirafvisionproxy-tblpw161.back4.app | Back4app Containers (server.py, Docker) | az ingyenes cím „ideiglenes” lehet |
| deno | https://zsirafvision-proxy.zsirafvision.deno.net | Deno Deploy (`deno-proxy/main.ts`, EU) | 100 GB/hó; IP-címes és nem szabványos portú (pl. lexanetwork :1344) streameket is elér – tesztelve |

Mindhárom `priority: 1`, a Worker körbeforgat köztük, és a halottat kihagyja.

## Regisztrációs állapot (2026.10.31)
- **Northflank:** „Signup is currently disabled” – új regisztráció tiltva.
- **Railway:** új regisztrációk felfüggesztve (októberi üzemzavar utáni helyreállítás).
- **Zeabur:** 2026.12.31-én leáll, új felhasználót nem fogad.
- **Back4app:** regisztrálva (GitHub zsirafmix), fut.
- **Deno Deploy:** regisztrálva (console.deno.com, org `zsirafvision`), fut.

## Deno Deploy proxy (`deno-proxy/`)
A `server.py` `PROXY_ONLY=1` módjának TypeScript portja (`Deno.serve`): azonos HMAC-aláírás (`url|exp|ua|ref`, SHA-256, 18 bájt, base64url), privát IP tiltás (DNS-feloldással, minden átirányításnál), host allowlist (csak kulcs nélkül), média content-type / 40 MB / 2 MB playlist / 15 s korlát, TLS-kivétel `.lexanetwork.com` + `TLS_INSECURE_HOSTS`, HLS playlist-átírás aláírt linkekkel, CORS, `GET /` → `OK - ZsirafVision proxy v4.7.1 (signed=yes)`.
Eltérés: a ténylegesen kapcsolódott (peer) IP nem kérdezhető le Deno alatt, ezért a DNS-ellenőrzés helyettesíti.

## Szolgáltatók (2026. október, rangsor)
| # | Szolgáltató | Ingyenes keret | Kártya | Belépés | Megjegyzés |
|---|---|---|---|---|---|
| 1 | Northflank | ~$20/hó erőforrás, 2 szolgáltatás, nem alszik | nem | GitHub | legjobb jelölt |
| 2 | Deno Deploy | 100 GB forgalom/hó | nem | GitHub | külön TS port kellene; IP/port elérés tesztelendő |
| 3 | Back4app Containers | 256 MB, 100 GB forgalom | nem | GitHub/Google | konténer élettartam korlátozott lehet |
| 4 | Zeabur | ingyenes, alszik tétlenül | nem | GitHub/Google | Worker cron ébren tartja |
| 5 | Railway | $5 próba 30 napig, utána $1/hó | nem | GitHub | gyorsan elfogy, rövid tartalék |
| 6 | Render (meglévő) | 750 óra/hó, **5 GB forgalom/hó 2026.04.23 óta** | nem | – | ez a szűk keresztmetszet! |
| – | Koyeb, Fly.io, Cloud Run, Oracle, Azure | | **kártya kell** | | kihagyva |
| – | Hugging Face Spaces (Docker) | ingyenes CPU Space | nem | Google/GitHub | streaming proxy a ToS szerint kétes, csak végső tartalék |

### Telepítési lépések szolgáltatónként
- **Northflank**: https://app.northflank.com/signup → GitHub. Token: https://app.northflank.com/ → Account → API → Tokens.
  New service → Combined (repo `zsirafmix/zsirafvision`, Dockerfile) → port 8080 public → env `PROXY_ONLY=1`, `RENDER_SIGN_KEY`.
  CLI: `npm i -g @northflank/cli && northflank login -t <TOKEN>`.
- **Zeabur**: https://zeabur.com → Login GitHub. Token: https://zeabur.com/account/developer. Deploy: `npx zeabur@latest auth login --token <TOKEN> && npx zeabur@latest deploy` (repo gyökérből, Dockerfile).
- **Railway**: https://railway.com/login → GitHub. Token: https://railway.com/account/tokens. `npm i -g @railway/cli; RAILWAY_TOKEN=... railway up` + `railway variables --set PROXY_ONLY=1 --set RENDER_SIGN_KEY=...`, majd `railway domain`.
- **Back4app**: https://containers.back4app.com/ → GitHub. Dashboardon: New App → repo → Dockerfile → env (nincs nyilvános CLI token, webes).
- **Deno Deploy**: https://dash.deno.com/signup → GitHub. Token: https://dash.deno.com/account#access-tokens. `deployctl deploy --project=zsirafvision-proxy main.ts` (külön port szükséges).
- **Hugging Face**: https://huggingface.co/join. Token (write): https://huggingface.co/settings/tokens. Docker Space, `app_port: 8080`, secret `RENDER_SIGN_KEY`.
