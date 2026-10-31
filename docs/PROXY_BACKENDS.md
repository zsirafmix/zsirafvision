# Tartalék proxyk és automatikus átváltás (v4.7.0)

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
`PROXY_ONLY=1`, `RENDER_SIGN_KEY=<ugyanaz, mint a Workeren>`. Ellenőrzés: `https://<app>/health` → `OK - ZsirafVision proxy v4.7.0 (signed=yes)`.
Utána a `PROXY_BACKENDS` listába felvenni és `npx wrangler deploy`.

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
